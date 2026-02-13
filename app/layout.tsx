import './globals.css'

export const metadata = {
  title: 'Team Jukebox',
  description: 'Phase 0 scaffold for Team Jukebox'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
