const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');  // uuid v8 compatible

const FHIR_BASE = process.env.EPIC_FHIR_BASE;
const TOKEN_URL = process.env.EPIC_TOKEN_URL;
const BACKEND_CLIENT_ID = process.env.EPIC_BACKEND_CLIENT_ID;
const PRIVATE_KEY = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

// Flow C — cached system token
let systemTokenCache = { token: null, expiresAt: 0 };

function generateBackendJWT() {
  return jwt.sign(
    {
      iss: BACKEND_CLIENT_ID,
      sub: BACKEND_CLIENT_ID,
      aud: TOKEN_URL,
      jti: uuidv4(),
      exp: Math.floor(Date.now() / 1000) + 240,
    },
    PRIVATE_KEY,
    { algorithm: 'RS384' }
  );
}

async function getSystemToken() {
  if (systemTokenCache.token && Date.now() < systemTokenCache.expiresAt) {
    return systemTokenCache.token;
  }
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: generateBackendJWT(),
  });
  const res = await axios.post(TOKEN_URL, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  systemTokenCache = {
    token: res.data.access_token,
    expiresAt: Date.now() + (res.data.expires_in - 60) * 1000,
  };
  return systemTokenCache.token;
}

function clearSystemTokenCache() {
  systemTokenCache = { token: null, expiresAt: 0 };
}

function fhirGet(path, token) {
  return axios.get(`${FHIR_BASE}/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
}

function fhirPost(path, body, token) {
  return axios.post(`${FHIR_BASE}/${path}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

// ── READ helpers (Flow A/B — patient token) ──────────────────────────────────

async function getPatient(patientId, token) {
  const res = await fhirGet(`Patient/${patientId}`, token);
  return res.data;
}

async function getConditions(patientId, token) {
  const res = await fhirGet(`Condition?patient=${patientId}&clinical-status=active`, token);
  return res.data.entry?.map(e => e.resource) ?? [];
}

async function getMedications(patientId, token) {
  const res = await fhirGet(`MedicationRequest?patient=${patientId}&status=active`, token);
  return res.data.entry?.map(e => e.resource) ?? [];
}

async function getVitals(patientId, token) {
  const res = await fhirGet(
    `Observation?patient=${patientId}&category=vital-signs&_sort=-date&_count=20`,
    token
  );
  return res.data.entry?.map(e => e.resource) ?? [];
}

async function getLabs(patientId, token) {
  const res = await fhirGet(
    `Observation?patient=${patientId}&category=laboratory&_sort=-date&_count=20`,
    token
  );
  return res.data.entry?.map(e => e.resource) ?? [];
}

async function getAllergies(patientId, token) {
  const res = await fhirGet(`AllergyIntolerance?patient=${patientId}`, token);
  return res.data.entry?.map(e => e.resource) ?? [];
}

async function getAppointments(patientId, token) {
  const res = await fhirGet(
    `Appointment?patient=${patientId}&status=booked&_sort=date&_count=5`,
    token
  );
  return res.data.entry?.map(e => e.resource) ?? [];
}

// ── WRITE helpers ─────────────────────────────────────────────────────────────

async function postQuestionnaireResponse(body, token) {
  const res = await fhirPost('QuestionnaireResponse', body, token);
  return { status: res.status, location: res.headers['location'], data: res.data };
}

async function postObservation(body, token) {
  const res = await fhirPost('Observation', body, token);
  return { status: res.status, location: res.headers['location'], data: res.data };
}

// ── Flow C — system-level patient pull ───────────────────────────────────────

async function systemPullPatient(patientId) {
  const token = await getSystemToken();
  const [patient, conditions, observations] = await Promise.all([
    getPatient(patientId, token),
    getConditions(patientId, token),
    getVitals(patientId, token),
  ]);
  return { patient, conditions, observations };
}

module.exports = {
  getSystemToken,
  clearSystemTokenCache,
  getPatient,
  getConditions,
  getMedications,
  getVitals,
  getLabs,
  getAllergies,
  getAppointments,
  postQuestionnaireResponse,
  postObservation,
  systemPullPatient,
};
