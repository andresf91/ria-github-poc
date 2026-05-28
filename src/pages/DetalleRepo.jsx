import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRepositoryDetails } from '../services/github'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteRepos') || '[]')
  } catch {
    return []
  }
}

export default function DetalleRepo() {
  const { owner, repo } = useParams()
  const [repository, setRepository] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const fetchRepo = async () => {
      setLoading(true)
      setError(null)
      try {
        const repoData = await getRepositoryDetails(owner, repo, controller.signal)
        setRepository(repoData)
        const favorites = getFavorites()
        setIsFavorite(favorites.some(r => r.id === repoData.id))
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.isRateLimit
            ? 'Límite de la API de GitHub alcanzado. Esperá unos minutos e intentá nuevamente.'
            : 'No pudimos cargar los detalles del repositorio.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
    return () => controller.abort()
  }, [owner, repo])

  const handleAddToFavorites = () => {
    if (!repository) return
    const favorites = getFavorites()
    const index = favorites.findIndex(r => r.id === repository.id)

    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push({
        id: repository.id,
        name: repository.name,
        owner: repository.owner.login,
        url: repository.html_url,
      })
    }

    localStorage.setItem('favoriteRepos', JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) return <Cargando />
  if (error) return <MensajeError message={error} onRetry={handleRetry} />
  if (!repository) return <MensajeError message="Repositorio no encontrado" onRetry={handleRetry} />

  return (
    <div className="container py-4">
      <Link to="/trending" className="btn btn-outline-light mb-4">
        ← Volver a Trending
      </Link>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="mb-2">{repository.name}</h1>
                  <p className="text-muted mb-0">
                    <Link to={`/user/${repository.owner.login}`} className="text-decoration-none">
                      {repository.owner.login}
                    </Link>
                  </p>
                </div>
                <button
                  className={`btn ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={handleAddToFavorites}
                >
                  <i className={`bi bi-star${isFavorite ? '-fill' : ''}`}></i>
                </button>
              </div>

              {repository.description && (
                <p className="card-text mb-4">{repository.description}</p>
              )}

              <div className="row g-3 mb-4">
                <div className="col-auto">
                  <div>
                    <small className="text-muted d-block">Estrellas</small>
                    <h5>{repository.stargazers_count.toLocaleString()}</h5>
                  </div>
                </div>
                <div className="col-auto">
                  <div>
                    <small className="text-muted d-block">Forks</small>
                    <h5>{repository.forks_count.toLocaleString()}</h5>
                  </div>
                </div>
                <div className="col-auto">
                  <div>
                    <small className="text-muted d-block">Watchers</small>
                    <h5>{repository.watchers_count.toLocaleString()}</h5>
                  </div>
                </div>
                <div className="col-auto">
                  <div>
                    <small className="text-muted d-block">Issues Abiertas</small>
                    <h5>{repository.open_issues_count}</h5>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {repository.language && (
                  <span className="badge bg-primary">{repository.language}</span>
                )}
                {repository.license && (
                  <span className="badge bg-secondary">{repository.license.name}</span>
                )}
                {repository.topics && repository.topics.slice(0, 5).map((topic) => (
                  <span key={topic} className="badge bg-dark text-light">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="row g-2 mb-4">
                <div className="col-auto">
                  <a
                    href={repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Ver en GitHub
                  </a>
                </div>
                {repository.homepage && (
                  <div className="col-auto">
                    <a
                      href={repository.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light"
                    >
                      Sitio Web
                    </a>
                  </div>
                )}
              </div>

              <hr className="border-secondary" />

              <div className="row g-4">
                <div className="col-sm-6">
                  <small className="text-muted d-block">Creado</small>
                  <p>{new Date(repository.created_at).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Último commit</small>
                  <p>{new Date(repository.pushed_at).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Rama principal</small>
                  <p><code>{repository.default_branch}</code></p>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Licencia</small>
                  <p>{repository.license?.name || 'Sin licencia especificada'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
