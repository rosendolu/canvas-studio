export default function NotFound() {
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
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ color: '#888' }}>Page not found</p>
      <a href="/" style={{ color: 'var(--mantine-color-brand-6)' }}>Back to home</a>
    </div>
  )
}
