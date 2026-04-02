'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      gap: '1rem',
    }}>
      <h1>Something went wrong</h1>
      <p style={{ color: '#888' }}>{error.message}</p>
      <button onClick={reset} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}
