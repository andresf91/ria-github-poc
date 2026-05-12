export default function MensajeError({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <div>
        <strong>Error:</strong> {message || 'Algo salió mal. Intenta nuevamente.'}
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}