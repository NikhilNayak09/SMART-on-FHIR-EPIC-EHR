import { useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '', withCredentials: true })

const initial = { fatigue: '', pain: '', painLocation: '', nausea: 'none', appetite: 'normal', mood: 'good', newSymptoms: '' }

export default function EproSurvey() {
  const [form, setForm] = useState(initial)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e) {
    e.preventDefault()
    setError(null); setResult(null); setLoading(true)
    try {
      const res = await api.post('/api/epro/submit', {
        ...form, fatigue: Number(form.fatigue), pain: Number(form.pain)
      })
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.error ?? e.response?.data?.errors?.join(', ') ?? 'Submission failed')
    } finally { setLoading(false) }
  }

  if (result) return (
    <div>
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
        <h2>Sent to your care team</h2>
        <p style={{ color: '#666', margin: '8px 0' }}>Submitted at {new Date(result.timestamp).toLocaleString()}</p>
        {result.resourceId && <p style={{ color: '#888', fontSize: '0.85rem' }}>Epic Resource ID: <code>{result.resourceId}</code></p>}
      </div>
      <div className="card">
        <details className="fhir-toggle">
          <summary>View FHIR Resource</summary>
          <pre className="fhir-json">{JSON.stringify(result.fhirResource, null, 2)}</pre>
        </details>
      </div>
      <button className="btn btn-primary" onClick={() => { setResult(null); setForm(initial) }}>
        Submit Another Survey
      </button>
    </div>
  )

  return (
    <div>
      <div className="card">
        <h2>Daily Symptom Survey</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
          Your responses will be sent directly to your care team's Epic chart.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Fatigue level today (0–10) *</label>
              <input type="number" min="0" max="10" required value={form.fatigue}
                onChange={e => set('fatigue', e.target.value)} placeholder="0 = none, 10 = worst" />
            </div>
            <div className="form-group">
              <label>Pain level today (0–10) *</label>
              <input type="number" min="0" max="10" required value={form.pain}
                onChange={e => set('pain', e.target.value)} placeholder="0 = none, 10 = worst" />
            </div>
          </div>

          <div className="form-group">
            <label>Pain location</label>
            <input type="text" value={form.painLocation} onChange={e => set('painLocation', e.target.value)}
              placeholder="e.g. lower back, chest" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nausea *</label>
              <select value={form.nausea} onChange={e => set('nausea', e.target.value)}>
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div className="form-group">
              <label>Appetite *</label>
              <select value={form.appetite} onChange={e => set('appetite', e.target.value)}>
                <option value="normal">Normal</option>
                <option value="reduced">Reduced</option>
                <option value="very-poor">Very poor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Mood *</label>
            <select value={form.mood} onChange={e => set('mood', e.target.value)}>
              <option value="good">Good</option>
              <option value="neutral">Neutral</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Any new symptoms?</label>
            <textarea rows="3" value={form.newSymptoms} onChange={e => set('newSymptoms', e.target.value)}
              placeholder="Describe any new or unusual symptoms..." style={{ resize: 'vertical' }} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit to Care Team'}
          </button>
        </form>
      </div>
    </div>
  )
}
