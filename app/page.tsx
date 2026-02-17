import React from 'react'
import UsernameEntry from '../src/components/UsernameEntry'
import AudioPlayer from '../src/components/AudioPlayer'
import SearchPanel from '../src/components/SearchPanel'
import QueuePanel from '../src/components/QueuePanel'

export default function Page() {
  return (
    <main className="page-main">
      <UsernameEntry />
      <AudioPlayer />
      <div className="page-grid">
        <SearchPanel />
        <QueuePanel />
      </div>
    </main>
  )
}
