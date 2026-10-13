const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

const CLIENT_ID = process.env.EPIC_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TOKEN_URL = process.env.EPIC_TOKEN_URL;
const AUTH_URL = process.env.EPIC_AUTH_URL;

// Temporary token handoff store — bridges tunnel callback to localhost session
const tokenHandoff = new Map();

// In-memory state store — keyed by state param, avoids session cookie issues
const stateStore = new Map();

const SCOPES = [
  'openid', 'fhirUser', 'offline_access',
  'patient/Patient.read',
  'patient/Condition.read',
  'patient/MedicationRequest.read',
  'patient/Observation.read',
  'patient/Observation.write',
  'patient/AllergyIntolerance.read',
  'patient/Appointment.read',
  'patient/QuestionnaireResponse.read',
  'patient/QuestionnaireResponse.write',
].join(' ');

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

// Flow A — standalone patient launch
router.get('/launch', (req, res) => {
  const { verifier, challenge } = generatePKCE();
  const state = crypto.randomBytes(16).toString('hex');

  // Store in memory instead of session
  stateStore.set(state, { verifier, flowType: 'A' });
  setTimeout(() => stateStore.delete(state), 10 * 60 * 1000); // expire after 10 min

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  res.redirect(`${AUTH_URL}?${params}`);
});

// Flow B — EHR launch (?launch=...&iss=...)
router.get('/ehr-launch', (req, res) => {
  const { launch, iss } = req.query;
  if (!launch || !iss) return res.status(400).json({ error: 'Missing launch or iss parameter' });

  const { verifier, challenge } = generatePKCE();
  const state = crypto.randomBytes(16).toString('hex');

  stateStore.set(state, { verifier, flowType: 'B', ehrIss: iss, ehrLaunch: launch });
  setTimeout(() => stateStore.delete(state), 10 * 60 * 1000);

  const authUrl = `${iss}/oauth2/authorize`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: `openid fhirUser launch offline_access patient/Patient.read patient/Condition.read patient/MedicationRequest.read patient/Observation.read patient/AllergyIntolerance.read patient/Appointment.read`,
    state,
    launch,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  res.redirect(`${authUrl}?${params}`);
});

// Shared callback for Flow A and B
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.status(400).json({ error });

  const stored = stateStore.get(state);
  if (!stored) return res.status(400).json({ error: 'State mismatch or expired' });
  stateStore.delete(state);

  const { verifier, flowType, ehrIss } = stored;
  const tokenUrl = flowType === 'B' ? `${ehrIss}/oauth2/token` : TOKEN_URL;

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    });

    const tokenRes = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    req.session.accessToken = tokenRes.data.access_token;
    req.session.refreshToken = tokenRes.data.refresh_token;
    req.session.patientId = tokenRes.data.patient;
    req.session.tokenExpiry = Date.now() + (tokenRes.data.expires_in - 60) * 1000;
    req.session.flowType = flowType;

    if (flowType === 'B') {
      req.session.practitioner = tokenRes.data.practitioner ?? null;
      req.session.department = tokenRes.data.department ?? null;
    }

    req.session.save(() => {
      // Store token data with a short-lived key, redirect frontend to pick it up
      const handoffKey = crypto.randomBytes(16).toString('hex');
      tokenHandoff.set(handoffKey, {
        accessToken: tokenRes.data.access_token,
        refreshToken: tokenRes.data.refresh_token,
        patientId: tokenRes.data.patient,
        tokenExpiry: Date.now() + (tokenRes.data.expires_in - 60) * 1000,
        flowType,
        practitioner: tokenRes.data.practitioner ?? null,
      });
      console.log('Handoff key created:', handoffKey, '| store size:', tokenHandoff.size);
      setTimeout(() => tokenHandoff.delete(handoffKey), 2 * 60 * 1000);
      res.redirect(`http://localhost:5173/dashboard?handoff=${handoffKey}`);
    });
  } catch (err) {
    console.error('Token exchange error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// Refresh token silently
router.post('/refresh', async (req, res) => {
  if (!req.session.refreshToken) return res.status(401).json({ error: 'No refresh token' });
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: req.session.refreshToken,
      client_id: CLIENT_ID,
    });
    const tokenRes = await axios.post(TOKEN_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    req.session.accessToken = tokenRes.data.access_token;
    req.session.tokenExpiry = Date.now() + (tokenRes.data.expires_in - 60) * 1000;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Disconnect — clear session
router.post('/disconnect', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// Handoff — frontend calls this to claim the session after tunnel redirect
router.get('/handoff', (req, res) => {
  const { key } = req.query;
  const data = tokenHandoff.get(key);
  if (!data) return res.status(400).json({ error: 'Invalid or expired handoff key' });

  req.session.accessToken = data.accessToken;
  req.session.refreshToken = data.refreshToken;
  req.session.patientId = data.patientId;
  req.session.tokenExpiry = data.tokenExpiry;
  req.session.flowType = data.flowType;
  req.session.practitioner = data.practitioner;

  req.session.save(() => {
    tokenHandoff.delete(key); // delete only after session is saved
    res.json({ ok: true, patientId: data.patientId });
  });
});

// Session status
router.get('/status', (req, res) => {
  if (!req.session.accessToken) return res.json({ connected: false });
  res.json({
    connected: true,
    patientId: req.session.patientId,
    flowType: req.session.flowType,
    practitioner: req.session.practitioner ?? null,
  });
});

module.exports = router;
