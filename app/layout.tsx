import './globals.css'
import ActiveUsersBadge from '../src/components/ActiveUsersBadge'

export const metadata = {
  title: 'Team Jukebox',
  description: 'Phase 0 scaffold for Team Jukebox'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <div className="app-header-left">
            <a href="/" className="app-brand">Team Jukebox</a>
            <nav className="app-nav">
              <a href="/">Home</a>
              <a href="/queue">Queue</a>
            </nav>
          </div>
          <div className="app-header-right">
            <ActiveUsersBadge />
          </div>
        </header>
        <div className="app-shell chrome-frame">{children}</div>
      </body>
    </html>
  )
}
