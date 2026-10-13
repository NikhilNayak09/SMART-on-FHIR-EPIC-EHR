# RestoreMe Epic POC — Feature Spec
> Spec-driven development reference. Each feature has acceptance criteria.
> Stack: Node.js/Express backend, React/Vite frontend.

---

## Feature 1 — Connect MyChart (Flow A: Standalone Patient Launch)

**User story:** As a RestoreMe patient, I can connect my Montefiore MyChart account so my clinical data loads automatically without re-typing.

**Acceptance criteria:**
- [ ] "Connect MyChart" button on patient dashboard initiates OAuth PKCE flow
- [ ] User is redirected to Epic's login page (not our login)
- [ ] After login + consent, user is redirected back to `/auth/callback`
- [ ] Access token and patient ID are stored in server session
- [ ] Patient name, DOB, MRN displayed on dashboard
- [ ] Active conditions (diagnoses) listed with SNOMED display name
- [ ] Current medications listed with dosage
- [ ] Recent observations (vitals + labs) listed, sorted by date
- [ ] Upcoming appointments listed
- [ ] Allergies listed
- [ ] Token refresh handled silently when token expires
- [ ] "Disconnect" button clears session

**Endpoints involved:**
- `GET /auth/launch` — initiates PKCE flow
- `GET /auth/callback` — handles Epic redirect, exchanges code for token
- `GET /api/patient/summary` — returns all pulled FHIR data for logged-in patient

---

## Feature 2 — ePRO Survey Write-Back

**User story:** As a RestoreMe patient, I can fill in my daily symptom survey and have it automatically sent to my care team's Epic chart.

**Survey questions (oncology ePRO):**
1. Fatigue level today (0–10 scale)
2. Pain level today (0–10 scale)
3. Pain location (free text)
4. Nausea (None / Mild / Moderate / Severe)
5. Appetite (Normal / Reduced / Very poor)
6. Mood (Good / Neutral / Low)
7. Any new symptoms? (free text)

**Acceptance criteria:**
- [ ] Survey form renders with all 7 questions
- [ ] Validation: numeric fields 0–10, required fields marked
- [ ] On submit, backend constructs a valid FHIR `QuestionnaireResponse`
- [ ] `POST /QuestionnaireResponse` to Epic sandbox succeeds (HTTP 201)
- [ ] Confirmation screen shows: "Sent to your care team ✓" + timestamp
- [ ] "View FHIR Resource" toggle shows the raw JSON that was written to Epic
- [ ] Resource ID returned by Epic is displayed (proves it was stored)
- [ ] Error state handled if Epic returns non-201

**FHIR resource shape:**
```json
{
  "resourceType": "QuestionnaireResponse",
  "status": "completed",
  "subject": { "reference": "Patient/{patientId}" },
  "authored": "{ISO8601 timestamp}",
  "item": [
    { "linkId": "fatigue", "text": "Fatigue level", "answer": [{ "valueInteger": 7 }] },
    { "linkId": "pain", "text": "Pain level", "answer": [{ "valueInteger": 3 }] }
  ]
}
```

**Endpoints involved:**
- `POST /api/epro/submit` — validates form, constructs FHIR, POSTs to Epic

---

## Feature 3 — Home Vitals Write-Back

**User story:** As a RestoreMe patient, I can log my home measurements and have them appear in my Epic chart automatically.

**Vitals supported:**
- Blood pressure (systolic + diastolic mmHg) — LOINC `85354-9`
- Heart rate (bpm) — LOINC `8867-4`
- Weight (kg) — LOINC `29463-7`
- Temperature (°C) — LOINC `8310-5`
- Oxygen saturation (%) — LOINC `59408-5`

**Acceptance criteria:**
- [ ] Vitals form with fields for each measurement (all optional except at least one required)
- [ ] Date/time picker for "when was this measured" (defaults to now)
- [ ] On submit, backend constructs FHIR `Observation` resource(s) with correct LOINC codes
- [ ] `POST /Observation` to Epic sandbox succeeds (HTTP 201)
- [ ] Confirmation shows which vitals were saved + Epic resource IDs
- [ ] "View FHIR Resource" toggle shows raw JSON
- [ ] Blood pressure uses `component` array (systolic + diastolic as separate components)

**Endpoints involved:**
- `POST /api/vitals/submit` — constructs FHIR Observation(s), POSTs to Epic

---

## Feature 4 — Backend Sync Dashboard (Flow C: System-to-System)

**User story:** As a RestoreMe admin, I can trigger a system-level sync that pulls data for all enrolled patients from Epic without requiring any patient login.

**Acceptance criteria:**
- [ ] Admin page shows "Last sync" timestamp
- [ ] "Run Sync Now" button triggers Flow C authentication
- [ ] Backend generates JWT signed with private key
- [ ] JWT exchanged for system access token from Epic
- [ ] For each mock-enrolled patient, pulls: Patient, Conditions, Observations
- [ ] Results table shows: Patient name | Resources pulled | Sync status | Timestamp
- [ ] Clicking a row expands to show raw FHIR data pulled
- [ ] System token obtained without any user interaction (proves Flow C works)
- [ ] Token expiry and re-auth handled

**Mock enrolled patients (sandbox):**
- Use Epic sandbox test patient IDs (Derrick Lin, Camila Lopez)

**Endpoints involved:**
- `POST /api/admin/sync` — triggers Flow C, returns sync results
- `GET /api/admin/sync/status` — returns last sync results

---

## Feature 5 — EHR Launch Simulator (Flow B)

**User story:** As a RestoreMe developer/demo presenter, I can simulate an EHR launch to show how RestoreMe would open inside Epic Hyperspace with patient context pre-loaded.

**Acceptance criteria:**
- [ ] Page explains what EHR launch is and how it works
- [ ] Input field to paste a launch token (or use sandbox pre-built launch URL)
- [ ] "Simulate Launch" button triggers Flow B OAuth
- [ ] After auth, displays: patient name, practitioner name, department
- [ ] Shows the RestoreMe patient dashboard for that patient
- [ ] Launch parameters (`iss`, `launch`) visible in a debug panel
- [ ] Works with Epic sandbox launch simulator at https://fhir.epic.com/Developer/Apps

**Endpoints involved:**
- `GET /auth/ehr-launch` — handles `?launch=&iss=` parameters, initiates EHR launch flow
- Reuses `/auth/callback` for token exchange

---

## Non-Functional Requirements

- All API calls use HTTPS
- No credentials in frontend code — all Epic calls go through our backend
- `.env` file for all secrets — never committed to git
- PKCE used for Flow A (no client secret in browser)
- Private key for Flow C stored as PEM file, path in `.env`
- Error messages never expose raw Epic error responses to frontend
- Loading states on all async operations
- Mobile-responsive UI (patients use phones)
