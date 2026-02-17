import './globals.css'

export const metadata = {
  title: 'Team Jukebox',
  description: 'Phase 0 scaffold for Team Jukebox'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '12px 24px', borderBottom: '1px solid #e6e6e6', display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'none' }}>Team Jukebox</a>
          <nav style={{ display: 'flex', gap: 12, marginLeft: 8 }}>
            <a href="/">Home</a>
            <a href="/queue">Queue</a>
          </nav>
        </header>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  )
}
