# Epic, explained: what it is and how an app like RestoreMe connects to it

A plain-language walkthrough to read before the implementation notes in `README.md`.
Researched 2026-09-28.

---

## 1. What Epic is

Epic is the **electronic health record (EHR)** that Montefiore runs. It's where the
hospital's real clinical record lives: diagnoses, medications, lab results, vitals,
appointments, clinical notes, insurance.

It isn't one product. It's a suite of modules installed per hospital. The ones that
matter to us:

| Epic module | What it is | Why we care |
|---|---|---|
| **Hyperspace** | The desktop app clinicians use all day | Where a provider would click to open RestoreMe from a patient's chart |
| **MyChart** | Epic's patient portal and mobile app | Patients already have MyChart logins, and we can reuse them |
| **Beacon** | Epic's oncology module (chemo regimens, treatment plans) | Our patients are oncology patients, so their treatment data lives here |
| **Interconnect** | The web-services layer that serves the APIs | The thing we actually talk to |

**Key point: there's no single "Epic API".** Every hospital runs its own copy of
Epic on its own servers, at its own URL. We'd integrate with **Montefiore's** Epic,
not with Epic the company. Epic the company runs the developer portal and the rules.
Montefiore decides what we're allowed to touch.

---

## 2. The three standards stacked on top of each other

People say "Epic API", "FHIR", "SMART" and "OAuth" as if they're the same thing.
They're layers:

```
┌──────────────────────────────────────────────────────────────┐
│  SMART on FHIR   "how a health app launches and gets access" │  ← healthcare-specific rules
├──────────────────────────────────────────────────────────────┤
│  OAuth 2.0 / OpenID Connect   "how to get a token"           │  ← same as "Sign in with Google"
├──────────────────────────────────────────────────────────────┤
│  FHIR R4   "what the data looks like, and the REST URLs"     │  ← the data format
├──────────────────────────────────────────────────────────────┤
│  HTTPS + JSON                                                │
└──────────────────────────────────────────────────────────────┘
```

### FHIR: the data

FHIR (pronounced "fire") is the healthcare industry's standard JSON format and REST
API. Everything is a **resource** with a fixed shape:

- `Patient`: demographics
- `Condition`: a diagnosis ("Malignant neoplasm of breast")
- `MedicationRequest`: a prescription
- `Observation`: any measurement (blood pressure, a lab value, a symptom score)
- `QuestionnaireResponse`: a filled-in survey (our ePROs)
- `DocumentReference`: a document (our patient-report PDFs)

Reading data is ordinary REST:

```
GET {base}/Patient/erXuFYUfucBZaryVksYEcMg3
GET {base}/Observation?patient=erXu...&category=vital-signs
```

Each code inside is standardised too. A blood pressure reading is LOINC code
`85354-9` at every hospital, whichever EHR it uses. That's why the archived
research told us to model our data on FHIR names: mapping becomes a lookup table
instead of guesswork.

### OAuth 2.0: the access

Nothing on Epic is public. Every request needs `Authorization: Bearer <token>`. We
get the token with OAuth 2.0, the same protocol behind "Sign in with Google". I
confirmed this: an unauthenticated request to the sandbox returns `401`.

### SMART on FHIR: the healthcare rules on top

SMART adds the parts OAuth doesn't define:

- **Launch context**: when the token comes back, it also says *which patient* it's
  for (`"patient": "erXu..."`). Plain OAuth has no idea what a patient is.
- **Scopes in a standard vocabulary**: `patient/Observation.read` means "read this
  one patient's observations".
- **Discovery**: every Epic install publishes its endpoints at
  `{base}/.well-known/smart-configuration`, so our code doesn't hardcode URLs.

---

## 3. The three ways an app gets in

This is the main design decision.

### A. Standalone patient launch: "Connect MyChart"

The patient starts in **our** app and links their hospital record.

```
Patient taps "Connect MyChart" in the RestoreMe app
   → browser opens Montefiore's MyChart login page (Epic's page, not ours)
   → patient logs in and approves "RestoreMe wants to read your meds, vitals…"
   → Epic redirects back to us with a one-time code
   → our server swaps the code for an access token (+ patient ID)
   → we call FHIR APIs for that one patient
```

- We never see the patient's MyChart password.
- Access is limited to that one patient.
- The token lasts about an hour. To keep syncing without asking the patient to log
  in again, we need a **refresh token**, which Epic only issues to a "confidential
  client" (one that holds a secret on our server).
- This works almost exactly like our **Garmin** connect flow today.

### B. EHR launch: open RestoreMe from inside Epic

The clinician starts in **Epic Hyperspace**, with a patient's chart open, and
clicks a RestoreMe button or tab.

```
Clinician has patient's chart open in Hyperspace
   → clicks "RestoreMe" → Epic opens our dashboard, passing a launch ID
   → our dashboard does the OAuth dance silently (clinician is already logged in to Epic)
   → token comes back with the patient AND the clinician identified
   → dashboard shows that patient's RestoreMe data inside Epic
```

- Providers don't need a second login and don't have to search for the patient.
- Montefiore's Epic team has to add the button to Hyperspace.

### C. Backend services: system-to-system

No human involved. Our server authenticates as itself.

```
task-scheduler (every night)
   → signs a short-lived JWT with our private key
   → Epic checks it against the public key we registered
   → returns an access token (1 hour)
   → we pull data for all enrolled patients, or run a bulk export
```

- No patient login and no refresh tokens to manage.
- It's the most powerful option, so it's the one Montefiore will scrutinise most.
  Epic requires the hospital to set up a "background user" so every call is audited.
- Because RestoreMe is **Montefiore's own program**, this may well be the one they
  prefer.

### Side by side

| | A. Patient (MyChart) | B. EHR launch | C. Backend |
|---|---|---|---|
| Who starts it | Patient, in our app | Clinician, in Epic | Our server, on a schedule |
| Who logs in | Patient (MyChart) | Clinician (already in Epic) | Nobody |
| Scope of access | One patient | Patient in context | Whatever Montefiore allows |
| Montefiore effort | Activate app | Activate app + add button in Hyperspace | Activate app + background user + approval |
| Closest thing we have | Garmin connect | Nothing yet | task-scheduler jobs |

---

## 4. How you get access at all

This is the slow part.

```
1. We register an app on fhir.epic.com (free)
      → pick the type (patient-facing / clinician / backend)
      → pick exactly which APIs we want (Observation.Read, Condition.Read, …)
      → Epic gives us two client IDs: non-production and production
2. We build and test against Epic's public sandbox (fake patients)
3. We mark the app "Ready for Production"
      → the app is now frozen: only redirect URLs and key URLs can change
4. Montefiore (the "community member") requests our app
      → they sign the open.epic API Subscription Agreement
      → their Epic team turns our client ID on in their environment
      → they decide which APIs are actually allowed and whether we can write
5. We get Montefiore's FHIR base URL and test in their non-prod (POC/TST)
6. Production
```

Steps 1–3 are on us and take days. Steps 4–5 are on Montefiore IT and are the
real timeline.

Step 3 freezes the app, so **choose the API list carefully.** Adding an API later
means registering a new app.

---

## 5. What Epic lets us read and write

From the sandbox's live capability list (Epic version August 2026):

| We'd want | Epic resource | Read | Write back |
|---|---|---|---|
| Vitals, labs | `Observation` | ✅ | ✅ |
| Diagnoses / cancer site | `Condition` | ✅ | ✅ |
| Medications | `MedicationRequest` | ✅ | ❌ |
| Allergies | `AllergyIntolerance` | ✅ | ✅ |
| Care plans, goals | `CarePlan`, `Goal` | ✅ | ❌ |
| ePRO surveys | `QuestionnaireResponse` | ✅ | ✅ |
| Patient report PDFs | `DocumentReference` | ✅ | ✅ |
| Diet orders | `NutritionOrder` | ✅ | ❌ |
| Appointments | `Appointment` | ✅ | ❌ |
| Insurance | `Coverage` | ✅ | ❌ |

Two directions, two different pitches:

- **Read (Epic → RestoreMe)**: patients stop re-typing meds and diagnoses, and
  dietitians see real labs. This is the easy one to get approved.
- **Write (RestoreMe → Epic)**: ePRO answers and home vitals land in the chart the
  oncologist already uses. This is where the value is for providers. Montefiore
  will be more cautious about it, because it puts data into the legal medical record.

---

## 6. The small print, in plain words

- **Every hospital has its own URL.** Discover the endpoints and don't hardcode them.
- **Non-prod and prod client IDs are separate.** The sandbox uses the non-prod one.
- **Key changes are slow to propagate**: up to an hour in the sandbox and up to 12
  hours at a hospital. Don't rotate keys the day before a demo.
- **Patients see a Data Use Questionnaire** (an extra consent screen) the first
  time they connect through MyChart. It's on by default now.
- **Epic updated its developer terms on 2025-10-31** to add federal (ONC) reporting
  requirements. Whoever signs the agreement should read that section.
- **Tokens are PHI keys.** A refresh token for a patient is effectively a key to
  their chart. It needs encryption at rest, which our Garmin tokens don't have today.

---

## 7. What the sample in `poc/` demonstrates

| File | What it shows |
|---|---|
| `standalone-launch.js` | Flow A end to end: "Connect MyChart" button → Epic login → token → reads the patient's name, problem list, meds and vitals |
| `backend-services.js` | Flow C: generates our key pair, signs the JWT, gets a system token |
| `fhir-map.js` | Converts an Epic `Observation` into our existing `VitalsHealthInput` shape, so Epic data enters RestoreMe through the vitals path we already have |

Everything up to the MyChart login screen is verified. The login itself needs us to
register an app on fhir.epic.com first, which takes about 10 minutes plus up to an
hour for sandbox sync.

---

## 8. Questions to discuss

1. **Which flow first?** A (patient connects MyChart), B (open from inside Epic), or C
   (backend sync)? My guess is that C is what Montefiore IT will prefer for their own
   program, with A as the fallback.
2. **Read only, or write back too?** Writing ePROs into the chart is the stronger
   pitch, but it takes longer to approve.
3. **Who at Montefiore owns the Epic side?** We need a named person to activate the
   app and give us the FHIR base URL.
4. **Should one of us register the sandbox app now**, so the POC runs end to end for
   a team demo?
