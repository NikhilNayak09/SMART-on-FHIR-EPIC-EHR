import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import EproSurvey from './pages/EproSurvey'
import Vitals from './pages/Vitals'
import AdminSync from './pages/AdminSync'
import EhrLaunch from './pages/EhrLaunch'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <span className="nav-brand">RestoreMe Epic POC</span>
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/epro">ePRO Survey</NavLink>
          <NavLink to="/vitals">Vitals</NavLink>
          <NavLink to="/admin">Admin Sync</NavLink>
          <NavLink to="/ehr-launch">EHR Launch</NavLink>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/epro" element={<EproSurvey />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/admin" element={<AdminSync />} />
          <Route path="/ehr-launch" element={<EhrLaunch />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
