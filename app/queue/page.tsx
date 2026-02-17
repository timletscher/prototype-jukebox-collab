import React from 'react'
import QueuePanel from '../../src/components/QueuePanel'

export default function QueuePage() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Queue</h1>
      <QueuePanel />
    </main>
  )
}
