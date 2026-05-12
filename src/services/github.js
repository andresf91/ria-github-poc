import axios from 'axios'

const API_BASE = 'https://api.github.com'
const ITEMS_PER_PAGE = 30

// Crear instancia de axios con configuración
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      console.warn('Límite de rate limit alcanzado. Usa un token para más solicitudes.')
    }
    return Promise.reject(error)
  }
)

// Servicio de búsqueda de usuarios
export const searchUsers = async (query, page = 1) => {
  try {
    const response = await api.get('/search/users', {
      params: {
        q: query,
        per_page: ITEMS_PER_PAGE,
        page,
        sort: 'followers',
        order: 'desc',
      },
    })
    return {
      users: response.data.items,
      total: response.data.total_count,
    }
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

// Obtener detalles de un usuario específico
export const getUserDetails = async (username) => {
  try {
    const userResponse = await api.get(`/users/${username}`)
    return userResponse.data
  } catch (error) {
    console.error('Error fetching user details:', error)
    throw error
  }
}

// Obtener repositorios de un usuario
export const getUserRepositories = async (username, page = 1) => {
  try {
    const response = await api.get(`/users/${username}/repos`, {
      params: {
        sort: 'stars',
        order: 'desc',
        per_page: ITEMS_PER_PAGE,
        page,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user repositories:', error)
    throw error
  }
}

// Obtener actividad reciente (últimos eventos)
export const getUserActivity = async (username) => {
  try {
    const response = await api.get(`/users/${username}/events/public`, {
      params: {
        per_page: 10,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return [] // Retornar array vacío si falla
  }
}

// Obtener repositorios trending (más estrellas, creados recientemente)
export const getTrendingRepositories = async (page = 1) => {
  try {
    // Buscar repos creados en el último mes, ordenados por estrellas
    const today = new Date()
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const formattedDate = lastMonth.toISOString().split('T')[0]

    const response = await api.get('/search/repositories', {
      params: {
        q: `created:>${formattedDate} stars:>100`,
        sort: 'stars',
        order: 'desc',
        per_page: ITEMS_PER_PAGE,
        page,
      },
    })
    return {
      repositories: response.data.items,
      total: response.data.total_count,
    }
  } catch (error) {
    console.error('Error fetching trending repositories:', error)
    throw error
  }
}

// Obtener detalles de un repositorio específico
export const getRepositoryDetails = async (owner, repo) => {
  try {
    const repoResponse = await api.get(`/repos/${owner}/${repo}`)
    return repoResponse.data
  } catch (error) {
    console.error('Error fetching repository details:', error)
    throw error
  }
}

export default api