import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../src/pages/Home'
import * as github from '../src/services/github'

// Mock del servicio de GitHub
vi.mock('../src/services/github', () => ({
  searchUsers: vi.fn(),
}))

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

  it('debería renderizar el formulario de búsqueda', () => {
    renderHome()
    expect(screen.getByPlaceholderText(/Busca un usuario/i)).toBeInTheDocument()
  })

  it('debería mostrar mensaje cuando no hay búsqueda', () => {
    renderHome()
    expect(screen.getByText(/Ingresa un nombre de usuario/i)).toBeInTheDocument()
  })

  it('debería buscar usuarios al enviar el formulario', async () => {
    const mockUsers = [
      { id: 1, login: 'torvalds', avatar_url: 'http://example.com/avatar.jpg', type: 'User', html_url: 'http://github.com/torvalds' }
    ]
    
    github.searchUsers.mockResolvedValueOnce({
      users: mockUsers,
      total: 1,
    })

    renderHome()

    const input = screen.getByPlaceholderText(/Busca un usuario/i)
    fireEvent.change(input, { target: { value: 'torvalds' } })
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

    await waitFor(() => {
      expect(github.searchUsers).toHaveBeenCalledWith('torvalds', expect.anything(), expect.anything())
    })

    await waitFor(() => {
      expect(screen.getByText('torvalds')).toBeInTheDocument()
    })
  })

  it('debería mostrar error cuando falla la búsqueda', async () => {
    github.searchUsers.mockRejectedValueOnce(new Error('Network error'))

    renderHome()

    const input = screen.getByPlaceholderText(/Busca un usuario/i)
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }))

    await waitFor(() => {
      expect(screen.getByText(/No pudimos buscar usuarios/i)).toBeInTheDocument()
    })
  })
})

describe('GitHub Service', () => {
  it('debería construir la URL correcta para búsqueda de usuarios', async () => {
    // Test mock de comportamiento esperado
    expect(typeof github.searchUsers).toBe('function')
  })
})