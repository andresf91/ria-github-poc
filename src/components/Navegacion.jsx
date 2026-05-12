import { Link } from 'react-router-dom'

export default function Navegacion() {
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
              <Link className="nav-link" to="/trending">
                Trending
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}