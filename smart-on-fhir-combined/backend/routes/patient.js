const express = require('express');
const router = express.Router();
const epic = require('../services/epicClient');

function requireSession(req, res, next) {
  if (!req.session.accessToken || !req.session.patientId) {
    return res.status(401).json({ error: 'Not connected to MyChart' });
  }
  next();
}

router.get('/summary', requireSession, async (req, res) => {
  const { accessToken, patientId } = req.session;
  try {
    const [patient, conditions, medications, vitals, labs, allergies, appointments] =
      await Promise.all([
        epic.getPatient(patientId, accessToken),
        epic.getConditions(patientId, accessToken),
        epic.getMedications(patientId, accessToken),
        epic.getVitals(patientId, accessToken),
        epic.getLabs(patientId, accessToken),
        epic.getAllergies(patientId, accessToken),
        epic.getAppointments(patientId, accessToken),
      ]);

    res.json({ patient, conditions, medications, vitals, labs, allergies, appointments });
  } catch (err) {
    console.error('Patient summary error:', err.response?.status, JSON.stringify(err.response?.data), err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch patient data' });
  }
});

// Debug — decode patient token to see granted scopes
router.get('/token-info', requireSession, (req, res) => {
  try {
    const parts = req.session.accessToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    res.json({ patientId: req.session.patientId, tokenPayload: payload });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
