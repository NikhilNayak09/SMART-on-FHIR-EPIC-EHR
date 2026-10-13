const express = require('express');
const router = express.Router();
const epic = require('../services/epicClient');

function requireSession(req, res, next) {
  if (!req.session.accessToken || !req.session.patientId) {
    return res.status(401).json({ error: 'Not connected to MyChart' });
  }
  next();
}

function validate(body) {
  const errors = [];
  if (body.fatigue == null || body.fatigue < 0 || body.fatigue > 10) errors.push('fatigue must be 0–10');
  if (body.pain == null || body.pain < 0 || body.pain > 10) errors.push('pain must be 0–10');
  if (!['none', 'mild', 'moderate', 'severe'].includes(body.nausea)) errors.push('invalid nausea value');
  if (!['normal', 'reduced', 'very-poor'].includes(body.appetite)) errors.push('invalid appetite value');
  if (!['good', 'neutral', 'low'].includes(body.mood)) errors.push('invalid mood value');
  return errors;
}

router.post('/submit', requireSession, async (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { accessToken, patientId } = req.session;
  const { fatigue, pain, painLocation = '', nausea, appetite, mood, newSymptoms = '' } = req.body;

  const resource = {
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    subject: { reference: `Patient/${patientId}` },
    authored: new Date().toISOString(),
    item: [
      { linkId: 'fatigue', text: 'Fatigue level today (0-10)', answer: [{ valueInteger: Number(fatigue) }] },
      { linkId: 'pain-level', text: 'Pain level today (0-10)', answer: [{ valueInteger: Number(pain) }] },
      { linkId: 'pain-location', text: 'Pain location', answer: [{ valueString: painLocation }] },
      { linkId: 'nausea', text: 'Nausea', answer: [{ valueCoding: { code: nausea, display: nausea.charAt(0).toUpperCase() + nausea.slice(1) } }] },
      { linkId: 'appetite', text: 'Appetite', answer: [{ valueCoding: { code: appetite, display: appetite } }] },
      { linkId: 'mood', text: 'Mood', answer: [{ valueCoding: { code: mood, display: mood.charAt(0).toUpperCase() + mood.slice(1) } }] },
      { linkId: 'new-symptoms', text: 'Any new symptoms?', answer: [{ valueString: newSymptoms }] },
    ],
  };

  try {
    const result = await epic.postQuestionnaireResponse(resource, accessToken);
    const resourceId = result.location?.split('/').slice(-3, -2)[0] ?? null;
    res.status(201).json({ ok: true, resourceId, timestamp: resource.authored, fhirResource: resource });
  } catch (err) {
    console.error('ePRO submit error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to submit survey to Epic' });
  }
});

module.exports = router;
