import { useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '', withCredentials: true })

export default function EhrLaunch() {
  const [status, setStatus] = useState(null)
  const [iss, setIss] = useState('https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4')
  const [launch, setLaunch] = useState('')

  useEffect(() => {
    api.get('/auth/status').then(r => { if (r.data.connected && r.data.flowType === 'B') setStatus(r.data) })
  }, [])

  function simulateLaunch() {
    if (!launch.trim()) return alert('Paste a launch token first')
    window.location.href = `/auth/ehr-launch?launch=${encodeURIComponent(launch)}&iss=${encodeURIComponent(iss)}`
  }

  return (
    <div>
      <div className="card">
        <h2>EHR Launch Simulator</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
          Flow B — Simulates how RestoreMe would open inside Epic Hyperspace when a clinician clicks the RestoreMe button from a patient's chart.
        </p>

        {status?.connected && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            ✅ EHR Launch active — Patient ID: <code>{status.patientId}</code>
            {status.practitioner && <> · Practitioner: <code>{status.practitioner}</code></>}
          </div>
        )}

        <div className="form-group">
          <label>Epic FHIR Base URL (iss)</label>
          <input type="text" value={iss} onChange={e => setIss(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Launch Token</label>
          <input type="text" value={launch} onChange={e => setLaunch(e.target.value)}
            placeholder="Paste launch token from Epic sandbox launch simulator" />
        </div>
        <button className="btn btn-primary" onClick={simulateLaunch}>
          Simulate EHR Launch
        </button>
      </div>

      <div className="card">
        <h3>How to get a launch token</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '2', fontSize: '0.9rem', color: '#555' }}>
          <li>Go to <a href="https://fhir.epic.com/Developer/Apps" target="_blank" rel="noreferrer" style={{ color: '#4fc3f7' }}>fhir.epic.com/Developer/Apps</a></li>
          <li>Find your app and click <strong>Launch</strong></li>
          <li>Select a test patient (e.g. Derrick Lin)</li>
          <li>Copy the <code>launch</code> parameter from the generated URL</li>
          <li>Paste it above and click Simulate EHR Launch</li>
        </ol>
      </div>

      <div className="card">
        <h3>Flow B vs Flow A</h3>
        <table className="table">
          <thead><tr><th></th><th>Flow A (Connect MyChart)</th><th>Flow B (EHR Launch)</th></tr></thead>
          <tbody>
            <tr><td>Who starts it</td><td>Patient in RestoreMe</td><td>Clinician in Epic Hyperspace</td></tr>
            <tr><td>Who logs in</td><td>Patient (MyChart)</td><td>Clinician (already in Epic)</td></tr>
            <tr><td>Launch URL</td><td><code>/auth/launch</code></td><td><code>/auth/ehr-launch?launch=&iss=</code></td></tr>
            <tr><td>Token includes</td><td>patient ID</td><td>patient ID + practitioner ID</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
