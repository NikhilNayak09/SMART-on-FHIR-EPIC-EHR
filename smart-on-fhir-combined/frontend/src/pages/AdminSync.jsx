import { useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '', withCredentials: true })

export default function AdminSync() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { fetchStatus() }, [])

  async function fetchStatus() {
    try {
      const res = await api.get('/api/admin/sync/status')
      setStatus(res.data)
    } catch {}
  }

  async function runSync() {
    setLoading(true)
    try {
      const res = await api.post('/api/admin/sync')
      setStatus({ lastSyncTime: res.data.syncTime, results: res.data.results })
    } catch (e) {
      alert('Sync failed: ' + (e.response?.data?.error ?? e.message))
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Backend Sync Dashboard</h2>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>
              Flow C — System-to-system JWT auth. No patient login required.
            </p>
          </div>
          <button className="btn btn-primary" onClick={runSync} disabled={loading}>
            {loading ? 'Syncing...' : '▶ Run Sync Now'}
          </button>
        </div>

        {status?.lastSyncTime && (
          <div className="alert alert-info">
            Last sync: {new Date(status.lastSyncTime).toLocaleString()}
          </div>
        )}

        {!status?.results && !loading && (
          <p style={{ color: '#888', textAlign: 'center', padding: '24px' }}>No sync run yet. Click "Run Sync Now" to start.</p>
        )}

        {status?.results && (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Status</th>
                <th>Patient</th>
                <th>Conditions</th>
                <th>Observations</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {status.results.map((r, i) => (
                <>
                  <tr key={i} onClick={() => setExpanded(expanded === i ? null : i)}>
                    <td><strong>{r.name}</strong><br /><span style={{ fontSize: '0.75rem', color: '#888' }}>{r.patientId}</span></td>
                    <td><span className={`badge ${r.status === 'success' ? 'badge-green' : 'badge-red'}`}>{r.status}</span></td>
                    <td>{r.resourcesPulled?.patient ?? '—'}</td>
                    <td>{r.resourcesPulled?.conditions ?? '—'}</td>
                    <td>{r.resourcesPulled?.observations ?? '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(r.timestamp).toLocaleTimeString()}</td>
                  </tr>
                  {expanded === i && r.data && (
                    <tr key={`exp-${i}`}>
                      <td colSpan="6" className="expandable-row">
                        <div className="expandable-content">
                          <details className="fhir-toggle">
                            <summary>View raw FHIR data for {r.name}</summary>
                            <pre className="fhir-json">{JSON.stringify(r.data, null, 2)}</pre>
                          </details>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>How Flow C Works</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '2', fontSize: '0.9rem', color: '#555' }}>
          <li>Backend generates a short-lived JWT signed with our private RSA key</li>
          <li>JWT is sent to Epic's token endpoint as a <code>client_assertion</code></li>
          <li>Epic verifies the JWT against our registered public key (JWKS URL)</li>
          <li>Epic returns a system access token (valid 1 hour)</li>
          <li>Backend uses the token to pull Patient, Conditions, and Observations for all enrolled patients</li>
          <li>No patient login required — runs as a background service</li>
        </ol>
      </div>
    </div>
  )
}
