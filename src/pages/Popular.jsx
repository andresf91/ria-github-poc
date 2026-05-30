import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrendingRepositories } from '../services/github'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

export default function Popular() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    // Si el API no responde en 2 segundos, muestra el mensaje de error.
    const timeoutId = setTimeout(() => {
      setError('No pudimos cargar los repositorios trending.')
      setLoading(false)
    }, 2000)

    const fetchTrending = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getTrendingRepositories(1, controller.signal)
        clearTimeout(timeoutId)
        setRepos(result.repositories)
        setError(null)
        setLoading(false)
      } catch (err) {
        clearTimeout(timeoutId)
        if (err.name !== 'CanceledError') {
          setError(err.isRateLimit
            ? 'Límite de la API de GitHub alcanzado. Esperá unos minutos e intentá nuevamente.'
            : 'No pudimos cargar los repositorios trending.')
          setLoading(false)
        }
      }
    }

    fetchTrending()
    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border mb-3" role="status" />
      <p className="text-muted">Buscando repositorios...</p>
    </div>
  )
  if (error) return <MensajeError message={error} onRetry={handleRetry} />

  return (
    <div className="container py-4">
      <h1 className="mb-4">Repositorios Populares</h1>
      <p className="text-muted mb-4">Repositorios más populares creados en el último mes</p>

      {repos.length === 0 ? (
        <div className="alert alert-info">No se encontraron repositorios.</div>
      ) : (
        <div className="row g-3">
          {repos.map((repo) => (
            <div key={repo.id} className="col-12">
              <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm"
                     style={{
                       cursor: 'pointer',
                       transition: 'transform 0.2s, box-shadow 0.2s'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateX(8px)'
                       e.currentTarget.style.boxShadow = '0 8px 16px rgba(88, 166, 255, 0.2)'
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateX(0)'
                       e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'
                     }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h5 className="card-title">
                          {repo.owner.login} / <strong>{repo.name}</strong>
                        </h5>
                        <p className="card-text text-muted mb-3">
                          {repo.description || 'Sin descripción disponible'}
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                          {repo.language && (
                            <div>
                              <span className="badge bg-secondary">{repo.language}</span>
                            </div>
                          )}
                          <small className="text-muted">
                            <i className="bi bi-star-fill"></i> {repo.stargazers_count.toLocaleString()} stars
                          </small>
                          <small className="text-muted">
                            <i className="bi bi-diagram-3"></i> {repo.forks_count.toLocaleString()} forks
                          </small>
                          {repo.topics && repo.topics.length > 0 && (
                            <div>
                              {repo.topics.slice(0, 3).map((topic) => (
                                <span key={topic} className="badge bg-dark text-light me-1 mb-1">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-auto text-end">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-light"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver Repo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
