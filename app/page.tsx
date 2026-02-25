import React from 'react'
import UsernameEntry from '../src/components/UsernameEntry'
import AudioPlayer from '../src/components/AudioPlayer'
import SearchPanel from '../src/components/SearchPanel'
import QueuePanel from '../src/components/QueuePanel'
import ActiveUsersBadge from '../src/components/ActiveUsersBadge'

export default function Page() {
  return (
    <main className="page-main">
      <UsernameEntry />
      <ActiveUsersBadge />
      <AudioPlayer />
      <div className="page-grid">
        <SearchPanel />
        <QueuePanel />
      </div>
    </main>
  )
}
