import React from 'react'
import QueueManager from '../../components/QueueManager'

export default function QueuePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Queue Admin</h1>
      <p>Peek, claim and complete queued items (development tool).</p>
      <QueueManager />
    </div>
  )
}
