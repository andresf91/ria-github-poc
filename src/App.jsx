import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navegacion from './components/Navegacion'
import Home from './pages/Home'
import DetalleUsuario from './pages/DetalleUsuario'
import Popular from './pages/Popular'
import DetalleRepo from './pages/DetalleRepo'

export default function App() {
  return (
    <BrowserRouter>
      <Navegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:username" element={<DetalleUsuario />} />
        <Route path="/trending" element={<Popular />} />
        <Route path="/repo/:owner/:repo" element={<DetalleRepo />} />
        <Route path="*" element={
          <div className="container py-5 text-center">
            <h1>404 - Página no encontrada</h1>
            <p className="text-muted">La página que buscas no existe</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}