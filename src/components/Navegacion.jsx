import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getTrendingRepositories } from '../services/github'

export default function Navegacion() {
  const [hoveringTrending, setHoveringTrending] = useState(false)
  const [previewRepos, setPreviewRepos] = useState([])
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const hideTimer = useRef(null)

  // Carga los repos trending la primera vez que se hace hover
  const loadPreview = async () => {
    if (previewLoaded) return
    try {
      const result = await getTrendingRepositories(1)
      setPreviewRepos(result.repositories.slice(0, 6))
      setPreviewLoaded(true)
    } catch {
      setPreviewRepos([])
    }
  }

  const handleMouseEnter = () => {
    clearTimeout(hideTimer.current)
    setHoveringTrending(true)
    loadPreview()
  }

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setHoveringTrending(false), 200)
  }

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-github"></i> GitHub Explorer
        </Link>
        <button
          className="navbar-toggler btn-outline-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favorites">
                Favoritos
              </Link>
            </li>

            {/* Trending con hover preview */}
            <li
              className="nav-item"
              style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link className="nav-link" to="/trending">
                Trending
              </Link>

              {hoveringTrending && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '300px',
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid #30363d',
                      fontSize: '0.75rem',
                      color: '#8b949e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    📈 Trending ahora
                  </div>

                  {previewRepos.length === 0 ? (
                    <div style={{ padding: '14px', color: '#8b949e', fontSize: '0.85rem' }}>
                      Cargando...
                    </div>
                  ) : (
                    previewRepos.map((repo) => (
                      <Link
                        key={repo.id}
                        to={`/repo/${repo.owner.login}/${repo.name}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '9px 14px',
                          borderBottom: '1px solid #21262d',
                          color: '#c9d1d9',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          <span style={{ color: '#8b949e' }}>{repo.owner.login}/</span>
                          <strong>{repo.name}</strong>
                        </span>
                        <span style={{ marginLeft: '8px', color: '#e3b341', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          ⭐ {repo.stargazers_count.toLocaleString()}
                        </span>
                      </Link>
                    ))
                  )}

                  <Link
                    to="/trending"
                    style={{
                      display: 'block',
                      padding: '9px 14px',
                      color: '#58a6ff',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Ver todos →
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
