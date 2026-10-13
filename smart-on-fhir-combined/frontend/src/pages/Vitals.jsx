import { useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '', withCredentials: true })

export default function Vitals() {
  const [form, setForm] = useState({ systolic: '', diastolic: '', heartRate: '', weight: '', temperature: '', spo2: '', effectiveDateTime: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    setError(null); setResult(null); setLoading(true)
    const payload = {}
    if (form.systolic && form.diastolic) { payload.systolic = form.systolic; payload.diastolic = form.diastolic }
    if (form.heartRate) payload.heartRate = form.heartRate
    if (form.weight) payload.weight = form.weight
    if (form.temperature) payload.temperature = form.temperature
    if (form.spo2) payload.spo2 = form.spo2
    if (form.effectiveDateTime) payload.effectiveDateTime = new Date(form.effectiveDateTime).toISOString()

    try {
      const res = await api.post('/api/vitals/submit', payload)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.error ?? 'Submission failed')
    } finally { setLoading(false) }
  }

  if (result) return (
    <div>
      <div className="card">
        <h2>✅ Vitals saved to Epic</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>Recorded at {new Date(result.timestamp).toLocaleString()}</p>
        {result.saved.map((s, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 600 }}>{s.vital}</span>
            {s.resourceId && <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '12px' }}>ID: {s.resourceId}</span>}
            <details className="fhir-toggle">
              <summary>View FHIR Resource</summary>
              <pre className="fhir-json">{JSON.stringify(s.fhirResource, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={() => { setResult(null); setForm({ systolic: '', diastolic: '', heartRate: '', weight: '', temperature: '', spo2: '', effectiveDateTime: '' }) }}>
        Log More Vitals
      </button>
    </div>
  )

  return (
    <div>
      <div className="card">
        <h2>Log Home Vitals</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
          At least one measurement required. Blood pressure requires both systolic and diastolic.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="section-title">Blood Pressure (LOINC 85354-9)</div>
          <div className="form-row" style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label>Systolic (mmHg)</label>
              <input type="number" value={form.systolic} onChange={e => set('systolic', e.target.value)} placeholder="e.g. 120" />
            </div>
            <div className="form-group">
              <label>Diastolic (mmHg)</label>
              <input type="number" value={form.diastolic} onChange={e => set('diastolic', e.target.value)} placeholder="e.g. 80" />
            </div>
          </div>

          <div className="section-title">Other Vitals</div>
          <div className="form-row">
            <div className="form-group">
              <label>Heart Rate (bpm) — LOINC 8867-4</label>
              <input type="number" value={form.heartRate} onChange={e => set('heartRate', e.target.value)} placeholder="e.g. 72" />
            </div>
            <div className="form-group">
              <label>Weight (kg) — LOINC 29463-7</label>
              <input type="number" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 72.5" />
            </div>
            <div className="form-group">
              <label>Temperature (°C) — LOINC 8310-5</label>
              <input type="number" step="0.1" value={form.temperature} onChange={e => set('temperature', e.target.value)} placeholder="e.g. 37.0" />
            </div>
            <div className="form-group">
              <label>Oxygen Saturation (%) — LOINC 59408-5</label>
              <input type="number" value={form.spo2} onChange={e => set('spo2', e.target.value)} placeholder="e.g. 98" />
            </div>
          </div>

          <div className="form-group">
            <label>When was this measured?</label>
            <input type="datetime-local" value={form.effectiveDateTime} onChange={e => set('effectiveDateTime', e.target.value)} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save to Epic Chart'}
          </button>
        </form>
      </div>
    </div>
  )
}
