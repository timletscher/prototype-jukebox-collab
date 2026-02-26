"use client"
import React, { useCallback, useEffect, useState } from 'react'
import type { QueueItem, WorkerResponse } from '../src/types/jukebox'

const WORKER_HEADER = 'x-worker-token'

const isApiError = (value: unknown): value is { error: string } =>
  !!value && typeof value === 'object' && 'error' in value

const getErrorMessage = (value: unknown) => {
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  return 'Unknown error'
}

export default function QueueManager() {
  const [items, setItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workerToken, setWorkerToken] = useState<string>(() => {
    try {
      return localStorage.getItem('workerToken') || ''
    } catch {
      return ''
    }
  })

  const fetchPeek = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (workerToken) headers[WORKER_HEADER] = workerToken

      const res = await fetch('/api/worker/process-queue', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'peek' })
      })
      const json = (await res.json()) as WorkerResponse
      if (!res.ok || isApiError(json)) throw new Error(isApiError(json) ? json.error : JSON.stringify(json))
      if ('items' in json) setItems(json.items || [])
      else setItems([])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [workerToken])

  useEffect(() => {
    fetchPeek()
  }, [fetchPeek])

  async function claimItem(id: string) {
    setLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (workerToken) headers[WORKER_HEADER] = workerToken

      const res = await fetch('/api/worker/process-queue', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'claim', ids: [id] })
      })
      const json = (await res.json()) as WorkerResponse
      if (!res.ok || isApiError(json)) throw new Error(isApiError(json) ? json.error : JSON.stringify(json))
      // refetch
      await fetchPeek()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function completeItem(id: string, success = true) {
    setLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (workerToken) headers[WORKER_HEADER] = workerToken

      const res = await fetch('/api/worker/process-queue', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'complete', ids: [id], success })
      })
      const json = (await res.json()) as WorkerResponse
      if (!res.ok || isApiError(json)) throw new Error(isApiError(json) ? json.error : JSON.stringify(json))
      await fetchPeek()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>
          Worker token (optional)
        </label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            value={workerToken}
            onChange={(e) => setWorkerToken(e.target.value)}
            placeholder="paste worker token here"
            style={{ flex: 1 }}
            className="input"
          />
          <button
            onClick={() => {
              try {
                if (workerToken) localStorage.setItem('workerToken', workerToken)
                else localStorage.removeItem('workerToken')
              } catch {
                /* ignore */
              }
            }}
          >
            Save
          </button>
        </div>
        <button onClick={fetchPeek} disabled={loading} style={{ marginRight: 8 }}>
          Refresh
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading…</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Data</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: 12 }}>
                No items
              </td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: 8 }}>{it.id}</td>
              <td style={{ padding: 8 }}>{it.status || 'unknown'}</td>
              <td style={{ padding: 8 }}>
                <pre style={{ margin: 0, maxHeight: 120, overflow: 'auto' }}>{JSON.stringify(it, null, 2)}</pre>
              </td>
              <td style={{ padding: 8 }}>
                <button onClick={() => claimItem(it.id)} style={{ marginRight: 8 }}>Claim</button>
                <button onClick={() => completeItem(it.id, true)} style={{ marginRight: 8 }}>Complete (success)</button>
                <button onClick={() => completeItem(it.id, false)}>Complete (fail)</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
