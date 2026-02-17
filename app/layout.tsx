import './globals.css'

export const metadata = {
  title: 'Team Jukebox',
  description: 'Phase 0 scaffold for Team Jukebox'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <a href="/" className="app-brand">Team Jukebox</a>
          <nav className="app-nav">
            <a href="/">Home</a>
            <a href="/queue">Queue</a>
          </nav>
        </header>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  )
}
