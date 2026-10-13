# Epic Integration — Compiled Understanding
> Generated from EPIC-PRIMER.md + Epic Integration Runbook + Montefiore Integration Plan docs.
> This is the persistent knowledge base for the RestoreMe Epic POC.
> Last updated: 2026-10-07

---

## 1. What Epic Is

Epic is the **Electronic Health Record (EHR)** that Montefiore runs. It is the legal system of record for all clinical data: diagnoses, medications, labs, vitals, appointments, notes, insurance.

Epic is not a single product — it is a suite of modules. The ones relevant to RestoreMe:

| Module | What it is | Why we care |
|---|---|---|
| **Hyperspace** | Desktop app clinicians use all day | Where a provider clicks to open RestoreMe from a patient's chart (Flow B) |
| **MyChart** | Epic's patient portal + mobile app | Patients already have MyChart logins — we reuse them (Flow A) |
| **Beacon** | Epic's oncology module | Our patients are oncology patients — treatment plans, chemo regimens live here |
| **Interconnect** | The web-services layer | The thing our code actually talks to |

**Critical point:** There is no single "Epic API". Every hospital runs its own copy of Epic on its own servers at its own URL. We integrate with **Montefiore's Epic**, not Epic the company. Epic the company sets the rules and runs the developer portal. Montefiore decides what we're allowed to touch.

---

## 2. The Three Standards (Layered)

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

### FHIR R4
- Healthcare industry standard JSON format + REST API
- Everything is a **resource** with a fixed shape
- Reading data is ordinary REST: `GET {base}/Patient/{id}`
- Codes inside resources are standardised (LOINC, SNOMED, RxNorm) — blood pressure is LOINC `85354-9` at every hospital

### OAuth 2.0
- Every Epic request needs `Authorization: Bearer <token>`
- Token obtained via OAuth 2.0 — same protocol as "Sign in with Google"
- Unauthenticated requests return `401`

### SMART on FHIR
Adds healthcare-specific rules on top of OAuth:
- **Launch context**: token comes back with `"patient": "erXu..."` — plain OAuth has no concept of a patient
- **Scopes**: `patient/Observation.read` = "read this one patient's observations"
- **Discovery**: every Epic install publishes endpoints at `{base}/.well-known/smart-configuration`

---

## 3. The Three Integration Flows

### Flow A — Standalone Patient Launch ("Connect MyChart")
Patient starts in RestoreMe and links their hospital record.

```
Patient taps "Connect MyChart"
  → browser opens Montefiore's MyChart login (Epic's page, not ours)
  → patient logs in and approves permissions
  → Epic redirects back with a one-time code
  → our server exchanges code for access token + patient ID
  → we call FHIR APIs for that patient
```

- We never see the patient's MyChart password
- Token lasts ~1 hour; refresh token needed for background sync
- Closest analogy: **Garmin connect flow** in existing RestoreMe

### Flow B — EHR Launch (Open RestoreMe from inside Epic)
Clinician has a patient's chart open in Hyperspace and clicks a RestoreMe button.

```
Clinician opens patient chart in Hyperspace
  → clicks "RestoreMe" button
  → Epic opens our app, passing ?launch=<token>&iss=<epic-base-url>
  → our app does OAuth silently (clinician already logged into Epic)
  → token comes back with patient ID + practitioner ID
  → we show that patient's RestoreMe data inside Epic
```

- Requires Montefiore IT to add the button to Hyperspace
- Providers don't need a second login

### Flow C — Backend Services (System-to-System)
No human involved. Our server authenticates as itself.

```
Scheduled job (nightly)
  → signs a short-lived JWT with our private key
  → Epic verifies against our registered public key
  → returns system access token (1 hour)
  → we pull/push data for all enrolled patients
```

- No patient login, no refresh tokens
- Most powerful — Montefiore will scrutinise most
- Requires a "background user" set up by Montefiore IT
- Closest analogy: **task-scheduler jobs** in existing RestoreMe

### Comparison Table

| | Flow A (Patient) | Flow B (EHR Launch) | Flow C (Backend) |
|---|---|---|---|
| Who starts it | Patient in our app | Clinician in Epic | Our server on schedule |
| Who logs in | Patient (MyChart) | Clinician (already in Epic) | Nobody |
| Scope of access | One patient | Patient in context | Whatever Montefiore allows |
| Montefiore effort | Activate app | Activate app + add button | Activate app + background user |
| Closest existing | Garmin connect | Nothing yet | task-scheduler |

---

## 4. FHIR Resources We Use

| Clinical concept | FHIR Resource | Read | Write |
|---|---|---|---|
| Patient demographics | `Patient` | ✅ | ❌ |
| Diagnoses / cancer site | `Condition` | ✅ | ✅ |
| Medications | `MedicationRequest` | ✅ | ❌ |
| Vitals, labs | `Observation` | ✅ | ✅ |
| Allergies | `AllergyIntolerance` | ✅ | ✅ |
| Care plans, goals | `CarePlan`, `Goal` | ✅ | ❌ |
| ePRO surveys | `QuestionnaireResponse` | ✅ | ✅ |
| Patient report PDFs | `DocumentReference` | ✅ | ✅ |
| Appointments | `Appointment` | ✅ | ❌ |

---

## 5. Sandbox & Production Credentials

### Epic Public Sandbox
- Base URL: `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4`
- OAuth base: `https://fhir.epic.com/interconnect-fhir-oauth/oauth2`
- Discovery: `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/.well-known/smart-configuration`
- Uses synthetic (fake) patients — no real PHI

### Our App Credentials
| App | Client ID | Type |
|---|---|---|
| RestoreMe POC (patient-facing) | `2ebf5e3e-6c71-480e-8c17-631767e6b9e0` | Confidential client, OAuth PKCE |
| RestoreMe POC Backend | `80858d9b-8377-4a7b-907c-fa9a56fa4e49` | Backend services, JWT auth |

### Sandbox Test Patients
Epic's sandbox has pre-built test patients. Key ones:
- **Camila Lopez** — general adult patient
- **Derrick Lin** — oncology patient (most relevant for RestoreMe)
- Full list: https://fhir.epic.com/Documentation?docId=testpatients

---

## 6. OAuth Scopes Required

### Patient App (Flow A + B)
```
openid fhirUser launch/patient
patient/Patient.read
patient/Condition.read
patient/MedicationRequest.read
patient/Observation.read
patient/Observation.write
patient/AllergyIntolerance.read
patient/Appointment.read
patient/QuestionnaireResponse.read
patient/QuestionnaireResponse.write
patient/DocumentReference.write
```

### Backend App (Flow C)
```
system/Patient.read
system/Condition.read
system/Observation.read
system/Observation.write
system/MedicationRequest.read
system/QuestionnaireResponse.write
```

---

## 7. Key Gotchas

1. **Every hospital has its own URL** — discover endpoints, never hardcode them
2. **Non-prod and prod client IDs are separate** — sandbox uses non-prod ID
3. **Key propagation is slow** — up to 1 hour in sandbox, 12 hours at a hospital. Don't rotate keys before a demo
4. **Patients see a Data Use Questionnaire** on first MyChart connect — this is Epic's consent screen, we can't skip it
5. **App freeze at step 3** — once marked "Ready for Production", only redirect URLs and key URLs can change. Adding an API later means a new app registration
6. **Tokens are PHI keys** — refresh tokens need encryption at rest
7. **Write-back is scrutinised** — writing to the legal medical record requires Montefiore sign-off. Read-only is easier to get approved first
8. **QuestionnaireResponse write in sandbox** — requires `patient/QuestionnaireResponse.write` scope explicitly ticked in app registration. This was likely the issue in previous attempts

---

## 8. Montefiore-Specific Notes

- Montefiore runs Epic with the **Beacon** oncology module — treatment plans and chemo regimens are in Beacon
- The integration plan calls for a **phased approach**: read-only first, then write-back
- A named Montefiore IT contact is needed to: activate the app, provide the production FHIR base URL, set up the background user for Flow C
- Non-prod (POC/TST) environment testing happens before production
- Montefiore must sign the open.epic API Subscription Agreement

---

## 9. How RestoreMe Data Maps to FHIR

| RestoreMe concept | FHIR resource | Key fields |
|---|---|---|
| Patient profile | `Patient` | `name`, `birthDate`, `identifier` (MRN) |
| Cancer diagnosis | `Condition` | `code` (SNOMED), `clinicalStatus`, `onsetDateTime` |
| Current medications | `MedicationRequest` | `medicationCodeableConcept` (RxNorm), `dosageInstruction` |
| Home blood pressure | `Observation` | `code.coding[0].code = "85354-9"` (LOINC), `component` (systolic/diastolic) |
| Home weight | `Observation` | `code.coding[0].code = "29463-7"` (LOINC), `valueQuantity` |
| ePRO fatigue score | `Observation` | `code.coding[0].code = "89243-0"` (LOINC PROMIS) |
| ePRO survey full | `QuestionnaireResponse` | `questionnaire`, `item[]` with linkId + answer |
| Patient report PDF | `DocumentReference` | `content[0].attachment.data` (base64), `type` |
