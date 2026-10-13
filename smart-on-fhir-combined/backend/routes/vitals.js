const express = require('express');
const router = express.Router();
const epic = require('../services/epicClient');

function requireSession(req, res, next) {
  if (!req.session.accessToken || !req.session.patientId) {
    return res.status(401).json({ error: 'Not connected to MyChart' });
  }
  next();
}

const VITAL_SIGNS_CATEGORY = [{
  coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }],
}];

function singleObservation(patientId, loincCode, display, value, unit, ucumCode, effectiveDateTime) {
  return {
    resourceType: 'Observation',
    status: 'final',
    category: VITAL_SIGNS_CATEGORY,
    code: { coding: [{ system: 'http://loinc.org', code: loincCode, display }] },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime,
    valueQuantity: { value: Number(value), unit, system: 'http://unitsofmeasure.org', code: ucumCode },
  };
}

function bpObservation(patientId, systolic, diastolic, effectiveDateTime) {
  return {
    resourceType: 'Observation',
    status: 'final',
    category: VITAL_SIGNS_CATEGORY,
    code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }] },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime,
    component: [
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
        valueQuantity: { value: Number(systolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
      },
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
        valueQuantity: { value: Number(diastolic), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' },
      },
    ],
  };
}

router.post('/submit', requireSession, async (req, res) => {
  const { accessToken, patientId } = req.session;
  const { systolic, diastolic, heartRate, weight, temperature, spo2, effectiveDateTime } = req.body;
  const dt = effectiveDateTime || new Date().toISOString();

  const observations = [];

  if (systolic && diastolic) observations.push(bpObservation(patientId, systolic, diastolic, dt));
  if (heartRate) observations.push(singleObservation(patientId, '8867-4', 'Heart rate', heartRate, '/min', '/min', dt));
  if (weight) observations.push(singleObservation(patientId, '29463-7', 'Body weight', weight, 'kg', 'kg', dt));
  if (temperature) observations.push(singleObservation(patientId, '8310-5', 'Body temperature', temperature, 'Cel', 'Cel', dt));
  if (spo2) observations.push(singleObservation(patientId, '59408-5', 'Oxygen saturation', spo2, '%', '%', dt));

  if (!observations.length) return res.status(400).json({ error: 'At least one vital is required' });

  try {
    const results = await Promise.all(
      observations.map(obs => epic.postObservation(obs, accessToken))
    );
    const saved = results.map((r, i) => ({
      vital: observations[i].code.coding[0].display,
      resourceId: r.location?.split('/').slice(-3, -2)[0] ?? null,
      fhirResource: observations[i],
    }));
    res.status(201).json({ ok: true, saved, timestamp: dt });
  } catch (err) {
    console.error('Vitals submit error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to submit vitals to Epic' });
  }
});

module.exports = router;
