/*

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleRepo from '../src/pages/DetalleRepo'
import * as github from '../src/services/github'

vi.mock('../src/services/github', () => ({
  getRepositoryDetails: vi.fn(),
}))

// Helper para renderizar con router params
const renderWithRouter = (owner, repo) =>
  render(
    <MemoryRouter initialEntries={[`/repo/${owner}/${repo}`]}>
      <Routes>
        <Route path="/repo/:owner/:repo" element={<DetalleRepo />} />
      </Routes>
    </MemoryRouter>
  )

const mockRepo = {
  id: 42,
  name: 'react',
  description: 'A JavaScript library for building user interfaces',
  owner: { login: 'facebook' },
  html_url: 'https://github.com/facebook/react',
  homepage: 'https://reactjs.org',
  stargazers_count: 218000,
  forks_count: 44000,
  watchers_count: 218000,
  open_issues_count: 850,
  language: 'JavaScript',
  license: { name: 'MIT License' },
  topics: ['javascript', 'ui', 'frontend'],
  default_branch: 'main',
  created_at: '2013-05-24T16:15:54Z',
  pushed_at: '2024-05-01T12:00:00Z',
}

describe('DetalleRepo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('debería mostrar el spinner mientras carga', () => {
    github.getRepositoryDetails.mockReturnValue(new Promise(() => {})) // nunca resuelve
    renderWithRouter('facebook', 'react')
    // Cargando usa un spinner de Bootstrap
    expect(document.querySelector('.spinner-border') || screen.queryByText(/cargando/i)).toBeTruthy()
  })

  it('debería renderizar los datos del repositorio correctamente', async () => {
    github.getRepositoryDetails.mockResolvedValueOnce(mockRepo)
    renderWithRouter('facebook', 'react')

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument()
    })

    expect(screen.getByText(/A JavaScript library/i)).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('MIT License')).toBeInTheDocument()
  })

  it('debería agregar y quitar de favoritos en localStorage', async () => {
    github.getRepositoryDetails.mockResolvedValueOnce(mockRepo)
    renderWithRouter('facebook', 'react')

    await waitFor(() => screen.getByText('react'))

    const favBtn = document.querySelector('.btn-outline-warning, .btn-warning')
    expect(favBtn).toBeTruthy()

    // Agregar a favoritos
    fireEvent.click(favBtn)
    const saved = JSON.parse(localStorage.getItem('favoriteRepos') || '[]')
    expect(saved.some((r) => r.id === mockRepo.id)).toBe(true)

    // Quitar de favoritos
    fireEvent.click(favBtn)
    const afterRemove = JSON.parse(localStorage.getItem('favoriteRepos') || '[]')
    expect(afterRemove.some((r) => r.id === mockRepo.id)).toBe(false)
  })

  it('debería mostrar mensaje de error cuando falla la carga', async () => {
    github.getRepositoryDetails.mockRejectedValueOnce(new Error('Not found'))
    renderWithRouter('nobody', 'norepo')

    await waitFor(() => {
      expect(screen.getByText(/No pudimos cargar los detalles/i)).toBeInTheDocument()
    })
  })
})
*/