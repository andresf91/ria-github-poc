import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleUsuario from '../src/pages/DetalleUsuario'
import * as github from '../src/services/github'

vi.mock('../src/services/github', () => ({
  getUserDetails: vi.fn(),
  getUserActivity: vi.fn(),
  getUserRepositories: vi.fn(),
}))

const renderWithRouter = (username = 'octocat') =>
  render(
    <MemoryRouter initialEntries={[`/user/${username}`]}>
      <Routes>
        <Route path="/user/:username" element={<DetalleUsuario />} />
      </Routes>
    </MemoryRouter>
  )

const mockUser = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://github.com/octocat.png',
  bio: 'A cool GitHub mascot',
  public_repos: 8,
  followers: 3000,
  following: 9,
  html_url: 'https://github.com/octocat',
  blog: 'https://octocat.github.io',
}

const mockActivity = [
  { type: 'PushEvent', repo: { name: 'octocat/Hello-World' }, created_at: '2024-01-01T00:00:00Z' },
  { type: 'ForkEvent', repo: { name: 'octocat/Spoon-Knife' }, created_at: '2024-01-02T00:00:00Z' },
]

const mockRepos = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `repo-${i + 1}`,
  description: `Description ${i + 1}`,
  owner: { login: 'octocat' },
  stargazers_count: 100 - i * 10,
  forks_count: 20,
  language: 'JavaScript',
}))

describe('DetalleUsuario Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    github.getUserDetails.mockResolvedValue(mockUser)
    github.getUserActivity.mockResolvedValue(mockActivity)
    github.getUserRepositories.mockResolvedValue(mockRepos)
  })

  it('debería mostrar el spinner mientras carga', () => {
    github.getUserDetails.mockReturnValue(new Promise(() => {}))
    renderWithRouter()
    expect(document.querySelector('.spinner-border') || screen.queryByText(/cargando/i)).toBeTruthy()
  })

  it('debería renderizar el perfil del usuario correctamente', async () => {
    renderWithRouter()

    await waitFor(() => expect(screen.getByText('The Octocat')).toBeInTheDocument())

    expect(screen.getByText('@octocat')).toBeInTheDocument()
    expect(screen.getByText('A cool GitHub mascot')).toBeInTheDocument()
    expect(screen.getByText('3000')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('debería mostrar el login como título cuando el usuario no tiene nombre', async () => {
    github.getUserDetails.mockResolvedValue({ ...mockUser, name: null })
    renderWithRouter()

    await waitFor(() => expect(screen.getByText('octocat')).toBeInTheDocument())
  })

  it('debería mostrar el botón de blog solo cuando el usuario tiene blog', async () => {
    const { unmount } = renderWithRouter()
    await waitFor(() => screen.getByText('The Octocat'))
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
    unmount()

    github.getUserDetails.mockResolvedValue({ ...mockUser, blog: null })
    renderWithRouter()
    await waitFor(() => screen.getByText('The Octocat'))
    expect(screen.queryByRole('link', { name: /blog/i })).not.toBeInTheDocument()
  })

  it('debería mostrar mensaje de error cuando falla la carga', async () => {
    github.getUserDetails.mockRejectedValue(new Error('Not found'))
    renderWithRouter()

    await waitFor(() =>
      expect(screen.getByText(/No pudimos cargar los datos del usuario/i)).toBeInTheDocument()
    )
  })

  it('debería mostrar la sección de actividad reciente cuando hay eventos', async () => {
    renderWithRouter()

    await waitFor(() => expect(screen.getByText('Actividad Reciente')).toBeInTheDocument())
    expect(screen.getByText('octocat/Hello-World')).toBeInTheDocument()
    expect(screen.getByText('Push')).toBeInTheDocument()
  })

  it('debería ocultar la sección de actividad cuando no hay eventos', async () => {
    github.getUserActivity.mockResolvedValue([])
    renderWithRouter()

    await waitFor(() => screen.getByText('The Octocat'))
    expect(screen.queryByText('Actividad Reciente')).not.toBeInTheDocument()
  })

  it('debería mostrar la sección de repositorios destacados', async () => {
    renderWithRouter()

    await waitFor(() => expect(screen.getByText('Repositorios Destacados')).toBeInTheDocument())
    expect(screen.getByText('repo-1')).toBeInTheDocument()
  })

  it('debería mostrar como máximo 6 repositorios aunque la API devuelva más', async () => {
    renderWithRouter()

    await waitFor(() => screen.getByText('Repositorios Destacados'))
    const repoCards = screen.getAllByText(/^repo-\d+$/)
    expect(repoCards).toHaveLength(6)
  })

  it('debería llamar a los tres servicios al montar con el username correcto', async () => {
    renderWithRouter('octocat')

    await waitFor(() => screen.getByText('The Octocat'))
    expect(github.getUserDetails).toHaveBeenCalledWith('octocat', expect.anything())
    expect(github.getUserActivity).toHaveBeenCalledWith('octocat', expect.anything())
    expect(github.getUserRepositories).toHaveBeenCalledWith('octocat', 1, expect.anything())
  })
})
