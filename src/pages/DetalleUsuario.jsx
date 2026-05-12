import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserDetails, getUserActivity, getUserRepositories } from '../services/github'
import Cargando from '../components/Cargando'
import MensajeError from '../components/ErrorMessage'

export default function DetalleUsuario() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [activity, setActivity] = useState([])
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [userRes, activityRes, reposRes] = await Promise.all([
          getUserDetails(username),
          getUserActivity(username),
          getUserRepositories(username),
        ])
        setUser(userRes)
        setActivity(activityRes)
        setRepos(reposRes.slice(0, 6)) // Mostrar solo los 6 primeros
      } catch (err) {
        setError('No pudimos cargar los datos del usuario.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username])

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) return <Cargando />
  if (error) return <MensajeError message={error} onRetry={handleRetry} />
  if (!user) return <MensajeError message="Usuario no encontrado" onRetry={handleRetry} />

  const eventTypeMap = {
    PushEvent: '📤 Push',
    PullRequestEvent: '🔀 Pull Request',
    CreateEvent: '✨ Creación',
    DeleteEvent: '🗑️ Eliminación',
    IssuesEvent: '⚠️ Issue',
    ForkEvent: '🍴 Fork',
    WatchEvent: '⭐ Star',
  }

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-outline-light mb-4">
        ← Volver
      </Link>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Tarjeta de perfil */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-auto">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="rounded-circle"
                    width="120"
                    height="120"
                  />
                </div>
                <div className="col">
                  <h1 className="card-title">{user.name || user.login}</h1>
                  <p className="text-muted mb-3">@{user.login}</p>
                  {user.bio && <p className="card-text mb-3">{user.bio}</p>}

                  <div className="row g-3 mb-3">
                    <div className="col-auto">
                      <div className="text-center">
                        <h5>{user.public_repos}</h5>
                        <small className="text-muted">Repositorios</small>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="text-center">
                        <h5>{user.followers}</h5>
                        <small className="text-muted">Seguidores</small>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="text-center">
                        <h5>{user.following}</h5>
                        <small className="text-muted">Siguiendo</small>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Ver Perfil
                    </a>
                    {user.blog && (
                      <a href={user.blog} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                        Blog
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          {activity.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-bottom border-secondary">
                <h5 className="mb-0">Actividad Reciente</h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {activity.slice(0, 5).map((event, idx) => (
                    <div key={idx} className="list-group-item bg-transparent border-secondary">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="mb-1">
                            <span className="badge bg-secondary me-2">
                              {eventTypeMap[event.type] || event.type}
                            </span>
                            <strong>{event.repo.name}</strong>
                          </p>
                          <small className="text-muted">
                            {new Date(event.created_at).toLocaleDateString('es-ES')}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Repositorios destacados */}
          {repos.length > 0 && (
            <div>
              <h5 className="mb-3">Repositorios Destacados</h5>
              <div className="row g-3">
                {repos.map((repo) => (
                  <div key={repo.id} className="col-md-6">
                    <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="text-decoration-none">
                      <div className="card h-100 border-0 shadow-sm" 
                           style={{ 
                             cursor: 'pointer',
                             transition: 'transform 0.2s, box-shadow 0.2s'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = 'translateY(-4px)'
                             e.currentTarget.style.boxShadow = '0 8px 16px rgba(88, 166, 255, 0.2)'
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = 'translateY(0)'
                             e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'
                           }}>
                        <div className="card-body">
                          <h6 className="card-title">{repo.name}</h6>
                          <p className="card-text small text-muted mb-3">
                            {repo.description || 'Sin descripción'}
                          </p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="bi bi-star-fill"></i> {repo.stargazers_count}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-diagram-3"></i> {repo.forks_count}
                            </small>
                            {repo.language && (
                              <small className="badge bg-secondary">{repo.language}</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}