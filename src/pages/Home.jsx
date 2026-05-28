import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { searchUsers } from '../services/github'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

export default function Home() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const abortRef = useRef(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      const result = await searchUsers(query, 1, abortRef.current.signal)
      setUsers(result.users)
      setSearched(true)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.isRateLimit
          ? 'Límite de la API de GitHub alcanzado. Esperá unos minutos e intentá nuevamente.'
          : 'No pudimos buscar usuarios. Intenta nuevamente.')
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    handleSearch({ preventDefault: () => {} })
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-lg-8 mx-auto text-center">
          <img
            src="/logo.png"
            alt="GitHub All Stars"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 24px rgba(255, 196, 0, 0.35))',
            }}
          />
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-4 text-center">Explorador de GitHub</h1>
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Busca un usuario de GitHub..."
                value={query}
                maxLength={100}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && <MensajeError message={error} onRetry={handleRetry} />}

      {loading && <Cargando />}

      {searched && !loading && !error && users.length === 0 && (
        <div className="alert alert-info text-center">
          No se encontraron usuarios para "{query}"
        </div>
      )}

      {users.length > 0 && (
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h3 className="mb-4">
              Resultados ({users.length} usuarios encontrados)
            </h3>
            <div className="row g-3">
              {users.map((user) => (
                <div key={user.id} className="col-md-6 col-lg-4">
                  <Link to={`/user/${user.login}`} className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm transition-all" 
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
                      <div className="card-body text-center">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="rounded-circle mb-3"
                          width="80"
                          height="80"
                        />
                        <h5 className="card-title">{user.login}</h5>
                        <p className="card-text text-muted small">
                          {user.type === 'User' ? 'Usuario' : 'Organización'}
                        </p>
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-light"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver en GitHub
                        </a>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!searched && !loading && (
        <div className="row">
          <div className="col-lg-8 mx-auto text-center text-muted">
            <p>Ingresa un nombre de usuario para comenzar la búsqueda</p>
          </div>
        </div>
      )}
    </div>
  )
}