import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockApi } = vi.hoisted(() => {
  const mockApi = {
    get: vi.fn(),
    interceptors: { response: { use: vi.fn() } },
  }
  return { mockApi }
})

vi.mock('axios', () => ({
  default: { create: vi.fn(() => mockApi) },
}))

import {
  searchUsers,
  getUserDetails,
  getUserRepositories,
  getUserActivity,
  getTrendingRepositories,
  getRepositoryDetails,
} from '../src/services/github'

describe('GitHub Service - searchUsers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('debería retornar users y total cuando la API responde correctamente', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { items: [{ id: 1, login: 'torvalds' }], total_count: 1 },
    })

    const result = await searchUsers('torvalds')
    expect(result.users).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.users[0].login).toBe('torvalds')
  })

  it('debería propagar el error cuando la API falla', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network error'))
    await expect(searchUsers('fail')).rejects.toThrow('Network error')
  })
})

describe('GitHub Service - getUserDetails', () => {
  beforeEach(() => vi.clearAllMocks())

  it('debería retornar los datos del usuario', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { login: 'octocat', followers: 10000, public_repos: 42 },
    })

    const result = await getUserDetails('octocat')
    expect(result.login).toBe('octocat')
    expect(result.followers).toBe(10000)
  })
})

describe('GitHub Service - getTrendingRepositories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('debería retornar repositories y total', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { items: [{ id: 99, name: 'cool-lib', stargazers_count: 5000 }], total_count: 1 },
    })

    const result = await getTrendingRepositories()
    expect(result.repositories).toHaveLength(1)
    expect(result.repositories[0].name).toBe('cool-lib')
  })

  it('debería usar un filtro de fecha del último mes', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { items: [], total_count: 0 } })

    await getTrendingRepositories()

    const queryParam = mockApi.get.mock.calls[0][1]?.params?.q || ''
    expect(queryParam).toMatch(/created:>/)
    expect(queryParam).toMatch(/stars:>100/)
  })
})

describe('GitHub Service - getUserRepositories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('debería retornar el array de repositorios del usuario', async () => {
    const mockRepos = [
      { id: 1, name: 'linux', stargazers_count: 180000 },
      { id: 2, name: 'subsurface', stargazers_count: 2000 },
    ]
    mockApi.get.mockResolvedValueOnce({ data: mockRepos })

    const result = await getUserRepositories('torvalds')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('linux')
  })

  it('debería solicitar los repos ordenados por estrellas descendente', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] })

    await getUserRepositories('torvalds')

    const params = mockApi.get.mock.calls[0][1]?.params
    expect(params.sort).toBe('stars')
    expect(params.order).toBe('desc')
  })

  it('debería propagar el error cuando la API falla', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Not found'))
    await expect(getUserRepositories('ghost')).rejects.toThrow('Not found')
  })
})

describe('GitHub Service - getUserActivity', () => {
  beforeEach(() => vi.clearAllMocks())

  it('debería retornar array vacío si la API falla (comportamiento tolerante a fallos)', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('403 Forbidden'))

    const result = await getUserActivity('someuser')
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(0)
  })
})
