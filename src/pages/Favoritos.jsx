import { useState } from 'react'
import { Link } from 'react-router-dom'

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteRepos') || '[]')
  } catch {
    return []
  }
}

export default function Favoritos() {
  const [favorites, setFavorites] = useState(getFavorites)

  const handleRemove = (id) => {
    const updated = favorites.filter(r => r.id !== id)
    setFavorites(updated)
    localStorage.setItem('favoriteRepos', JSON.stringify(updated))
  }

  return (
    <div className="container py-4">
      <h1 className="mb-2">Repositorios Favoritos</h1>
      <p className="text-muted mb-4">
        {favorites.length === 0
          ? 'No tenés repositorios guardados.'
          : `${favorites.length} repositorio${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}.`}
      </p>

      {favorites.length === 0 ? (
        <div className="alert alert-info">
          Todavía no guardaste ningún favorito. Explorá un repositorio y marcalo con la estrella.{' '}
          <Link to="/trending">Ver trending</Link>
        </div>
      ) : (
        <div className="row g-3">
          {favorites.map((repo) => (
            <div key={repo.id} className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <Link
                      to={`/repo/${repo.owner}/${repo.name}`}
                      className="text-decoration-none"
                    >
                      <h5 className="mb-1">
                        <span style={{ color: '#8b949e' }}>{repo.owner}/</span>
                        <strong>{repo.name}</strong>
                      </h5>
                    </Link>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small"
                    >
                      Ver en GitHub
                    </a>
                  </div>
                  <button
                    className="btn btn-warning btn-sm flex-shrink-0"
                    onClick={() => handleRemove(repo.id)}
                    title="Quitar de favoritos"
                  >
                    <i className="bi bi-star-fill me-1"></i>
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
