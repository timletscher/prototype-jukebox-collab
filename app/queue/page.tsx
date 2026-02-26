import React from 'react'
import QueuePanel from '../../src/components/QueuePanel'

export default function QueuePage() {
  return (
    <main className="page-main" style={{ maxWidth: 720 }}>
      <h1 className="page-title">Queue</h1>
      <QueuePanel />
    </main>
  )
}
