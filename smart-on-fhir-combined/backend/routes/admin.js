const express = require('express');
const router = express.Router();
const epic = require('../services/epicClient');

const ENROLLED_PATIENTS = [
  { id: 'eq081-VQEgP8drUUqCWzHfw3', name: 'Derrick Lin' },
  { id: 'erXuFYUfucBZaryVksYEcMg3', name: 'Camila Lopez' },
];

let lastSyncResults = null;
let lastSyncTime = null;

// Debug — decode the system token to see what scopes Epic actually granted
router.get('/token-decode', async (req, res) => {
  try {
    epic.clearSystemTokenCache();
    const token = await epic.getSystemToken();
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    res.json({ payload });
  } catch (err) {
    res.status(500).json({ error: err.response?.data ?? err.message });
  }
});

// Debug — clear cached system token and force fresh one
router.post('/clear-token', (req, res) => {
  epic.clearSystemTokenCache();
  res.json({ ok: true, message: 'Token cache cleared' });
});

// Debug — confirm system token works
router.get('/token-test', async (req, res) => {
  try {
    const token = await epic.getSystemToken();
    res.json({ ok: true, tokenPreview: token.substring(0, 40) + '...' });
  } catch (err) {
    res.status(500).json({ error: err.response?.data ?? err.message });
  }
});

// Debug — direct patient fetch with system token
router.get('/patient-test', async (req, res) => {
  try {
    const token = await epic.getSystemToken();
    const data = await epic.getPatient('erXuFYUfucBZaryVksYEcMg3', token);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message, status: err.response?.status, epicError: err.response?.data });
  }
});

// Debug — test each resource type individually
router.get('/scope-test', async (req, res) => {
  const token = await epic.getSystemToken();
  const patientId = 'erXuFYUfucBZaryVksYEcMg3';
  const results = {};
  for (const [name, fn] of [
    ['conditions', () => epic.getConditions(patientId, token)],
    ['observations', () => epic.getVitals(patientId, token)],
    ['medications', () => epic.getMedications(patientId, token)],
  ]) {
    try {
      const data = await fn();
      results[name] = { ok: true, count: data.length };
    } catch (err) {
      results[name] = { ok: false, status: err.response?.status, detail: err.response?.data?.issue?.[0]?.diagnostics ?? err.message, raw: err.response?.data };
    }
  }
  res.json(results);
});

router.post('/sync', async (req, res) => {
  try {
    const results = await Promise.all(
      ENROLLED_PATIENTS.map(async ({ id, name }) => {
        try {
          const data = await epic.systemPullPatient(id);
          return {
            patientId: id,
            name,
            status: 'success',
            resourcesPulled: {
              patient: 1,
              conditions: data.conditions.length,
              observations: data.observations.length,
            },
            data,
            timestamp: new Date().toISOString(),
          };
        } catch (err) {
          return {
            patientId: id,
            name,
            status: 'error',
            error: err.response?.data?.issue?.[0]?.diagnostics ?? err.message,
            rawError: err.response?.data ?? null,
            timestamp: new Date().toISOString(),
          };
        }
      })
    );

    lastSyncResults = results;
    lastSyncTime = new Date().toISOString();
    res.json({ ok: true, syncTime: lastSyncTime, results });
  } catch (err) {
    console.error('Admin sync error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Sync failed' });
  }
});

router.get('/sync/status', (req, res) => {
  res.json({ lastSyncTime, results: lastSyncResults });
});

module.exports = router;
