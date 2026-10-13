import { useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '', withCredentials: true })

export default function Dashboard() {
  const [status, setStatus] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const handoff = params.get('handoff')
    if (handoff) {
      // Remove key from URL immediately to prevent double call
      window.history.replaceState({}, '', '/dashboard')
      api.get(`/auth/handoff?key=${handoff}`).then(() => {
        checkStatus()
      }).catch(() => checkStatus())
    } else {
      checkStatus()
    }
  }, [])

  async function checkStatus() {
    try {
      const res = await api.get('/auth/status')
      setStatus(res.data)
      if (res.data.connected) fetchSummary()
      else setLoading(false)
    } catch { setLoading(false) }
  }

  async function fetchSummary() {
    try {
      const res = await api.get('/api/patient/summary')
      setSummary(res.data)
    } catch (e) {
      setError('Failed to load patient data')
    } finally { setLoading(false) }
  }

  async function disconnect() {
    await api.post('/auth/disconnect')
    setStatus(null); setSummary(null)
  }

  function connectMyChart() {
    window.location.href = '/auth/launch'
  }

  if (loading) return <div className="loading">Loading...</div>

  if (!status?.connected) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏥</div>
          <h2 style={{ marginBottom: '8px' }}>Connect Your MyChart Account</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Link your Montefiore MyChart account to load your clinical data automatically.
          </p>
          <button className="btn btn-primary" onClick={connectMyChart} style={{ fontSize: '1rem', padding: '12px 32px' }}>
            Connect MyChart
          </button>
        </div>
      </div>
    )
  }

  const p = summary?.patient
  const name = p?.name?.[0]?.text ?? 'Patient'
  const dob = p?.birthDate ?? '—'
  const mrn = p?.identifier?.find(i => i.type?.text === 'EXTERNAL')?.value ?? '—'
  const gender = p?.gender ?? '—'

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="patient-header">
          <div className="patient-avatar">{name.charAt(0)}</div>
          <div>
            <div className="patient-name">{name}</div>
            <div className="patient-meta">DOB: {dob} · MRN: {mrn} · {gender}</div>
            <span className="badge badge-green" style={{ marginTop: '4px' }}>MyChart Connected</span>
          </div>
          <button className="btn btn-danger" onClick={disconnect} style={{ marginLeft: 'auto' }}>
            Disconnect
          </button>
        </div>

        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-value">{summary?.conditions?.length ?? 0}</div>
            <div className="stat-label">Active Conditions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary?.medications?.length ?? 0}</div>
            <div className="stat-label">Medications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary?.appointments?.length ?? 0}</div>
            <div className="stat-label">Upcoming Appointments</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Active Conditions</h3>
          {summary?.conditions?.length === 0 && <p style={{ color: '#888' }}>None found</p>}
          {summary?.conditions?.map((c, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.code?.text ?? c.code?.coding?.[0]?.display}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Since {c.onsetDateTime?.split('T')[0] ?? '—'}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Current Medications</h3>
          {summary?.medications?.length === 0 && <p style={{ color: '#888' }}>None found</p>}
          {summary?.medications?.map((m, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.medicationCodeableConcept?.text ?? '—'}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{m.dosageInstruction?.[0]?.text ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Recent Vitals</h3>
          {summary?.vitals?.slice(0, 5).map((v, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v.code?.text ?? v.code?.coding?.[0]?.display}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                {v.valueQuantity ? `${v.valueQuantity.value} ${v.valueQuantity.unit}` : '—'} · {v.effectiveDateTime?.split('T')[0]}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Allergies</h3>
          {summary?.allergies?.length === 0 && <p style={{ color: '#888' }}>None found</p>}
          {summary?.allergies?.map((a, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.code?.coding?.[0]?.display ?? '—'}</div>
              <span className={`badge ${a.criticality === 'high' ? 'badge-red' : 'badge-gray'}`}>{a.criticality ?? 'unknown'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Upcoming Appointments</h3>
        {summary?.appointments?.length === 0 && <p style={{ color: '#888' }}>No upcoming appointments</p>}
        <table className="table">
          <thead><tr><th>Date</th><th>Type</th><th>Provider</th></tr></thead>
          <tbody>
            {summary?.appointments?.map((a, i) => (
              <tr key={i}>
                <td>{new Date(a.start).toLocaleDateString()}</td>
                <td>{a.serviceType?.[0]?.coding?.[0]?.display ?? '—'}</td>
                <td>{a.participant?.find(p => p.actor?.type === 'Practitioner')?.actor?.display ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
