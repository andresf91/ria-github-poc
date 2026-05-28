import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Popular from '../src/pages/Popular'
import * as github from '../src/services/github'

vi.mock('../src/services/github', () => ({
  getTrendingRepositories: vi.fn(),
}))

const renderPopular = () =>
  render(
    <MemoryRouter>
      <Popular />
    </MemoryRouter>
  )

const mockRepositories = [
  {
    id: 1,
    name: 'awesome-project',
    description: 'An awesome open source project',
    owner: { login: 'octocat' },
    html_url: 'https://github.com/octocat/awesome-project',
    stargazers_count: 5300,
    forks_count: 420,
    language: 'TypeScript',
    topics: ['typescript', 'tooling'],
  },
  {
    id: 2,
    name: 'another-repo',
    description: 'Another trending repo',
    owner: { login: 'devuser' },
    html_url: 'https://github.com/devuser/another-repo',
    stargazers_count: 2100,
    forks_count: 180,
    language: 'Python',
    topics: [],
  },
]

describe('Popular (Trending) Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería mostrar el título de la página', async () => {
    github.getTrendingRepositories.mockResolvedValueOnce({ repositories: [] })
    renderPopular()
    // El título aparece durante carga o después
    await waitFor(() => {
      expect(screen.getByText(/Repositorios Populares/i)).toBeInTheDocument()
    })
  })

  it('debería listar los repositorios trending recibidos', async () => {
    github.getTrendingRepositories.mockResolvedValueOnce({ repositories: mockRepositories })
    renderPopular()

    await waitFor(() => {
      expect(screen.getByText('awesome-project')).toBeInTheDocument()
      expect(screen.getByText('another-repo')).toBeInTheDocument()
    })

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('debería mostrar mensaje cuando no hay repositorios', async () => {
    github.getTrendingRepositories.mockResolvedValueOnce({ repositories: [] })
    renderPopular()

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron repositorios/i)).toBeInTheDocument()
    })
  })

  it('debería mostrar error si la API falla', async () => {
    github.getTrendingRepositories.mockRejectedValueOnce(new Error('API error'))
    renderPopular()

    await waitFor(() => {
      expect(screen.getByText(/No pudimos cargar los repositorios trending/i)).toBeInTheDocument()
    })
  })

  it('debería llamar a getTrendingRepositories al montar el componente', async () => {
    github.getTrendingRepositories.mockResolvedValueOnce({ repositories: [] })
    renderPopular()

    await waitFor(() => {
      expect(github.getTrendingRepositories).toHaveBeenCalledTimes(1)
    })
  })
})
