# Epic EHR Integration — Developer Summary

Summary of the integration plan, runbook, and healthcare crash course documents.

| Doc | What it is |
|---|---|
| **Epic Integration Plan** | The *what and why*: data flows, architecture, phases, security, risks |
| **Epic Integration Runbook** | The *how*: a 13-step checklist from Epic registration to go-live |
| **Epic & Healthcare Crash Course** | Background: Epic vocabulary, regulation, how to talk to the hospital |

---

## 1. The goal in one paragraph

Connect a **Patient Care & Wellness App** (iOS, Android, web) to a hospital's Epic EHR through standard **FHIR R4** APIs, using Epic's free developer site (fhir.epic.com).

- Patients sign in with **MyChart** (SMART on FHIR *standalone launch*).
- **Epic → app (read):** demographics, care team, medications, allergies, problems, appointments, discharge instructions and care plan.
- **App → Epic (write):** patient-entered vitals, fluid intake and symptom check-ins, filed into Epic flowsheets and questionnaires. Red-flag values raise alerts inside Epic (In Basket).
- Start **read-only**, then turn on write-back **one data type at a time** after the hospital's clinicians sign off.
- Expected timeline: roughly 6–9 months, and the hospital's Epic team sets the real pace.

---

## 2. Ground rules (non-negotiable)

1. **The mobile and web apps never call Epic directly.** Everything goes through your own **US-hosted integration layer** (a FHIR gateway).
2. **Confidential client.** Epic credentials and tokens live only in the gateway, never on the device.
3. **Work only on sandbox, synthetic or de-identified data.** No standing production PHI access.
4. **Never put real patient data in the Epic sandbox.**
5. **Never touch Epic's database directly or scrape screens.** Use only FHIR APIs.
6. **Don't hard-code Epic URLs.** Read them from each hospital's `.well-known/smart-configuration`.
7. **Request only the scopes the current phase needs**, and add more phase by phase.

---

## 3. Checklist (from the Runbook)

Steps 1–7 can be done independently. The hospital joins from step 8.

### Stage A: Register with Epic

- [ ] **1. Gather registration material:**
  - legal company name
  - app name and description
  - logo
  - public **privacy policy** and **terms of use** URLs
  - **redirect URIs** for the integration layer
  - a **JWK Set URL** that hosts your public keys
- [ ] **2. Create a developer account** on fhir.epic.com
- [ ] **3. Create the app record** (Build Apps → Create):
  - Audience: **Patients**
  - APIs: `Patient.Read`, `MedicationRequest.Search`, `AllergyIntolerance.Search`, `Condition.Search`, `Appointment.Search`, `DocumentReference.Search`, `Observation.Create`
  - SMART on FHIR **R4**, client type **confidential**
  - Turn on **persistent access** (refresh tokens)
  - Non-prod and prod redirect URIs and JWK Set URLs
- [ ] **4. Store both client IDs** (non-production and production) in a secrets manager.

### Stage B: Build against the sandbox

- [ ] **5. Build the Epic connection:**
  - Read the SMART configuration to get the `authorize` and `token` endpoints.
  - Implement the **authorization code flow with PKCE**.
  - Sign in as the sandbox **MyChart test users** (fhir.epic.com → test patients).
- [ ] **6. Build the integration layer:**
  - **Token vault:** encrypted and server-side only. Refresh tokens never go on the device.
  - **FHIR client:** call `{base}/Patient/{id}`, `{base}/Observation` etc.
  - **Mapping:** convert app values to Epic codes (LOINC), units and flowsheet rows.
  - **Validation:** check units and ranges before any write.
  - **Idempotent writes with retry:** a retry must never create duplicate chart data.
  - **Full audit log:** who, what and when for every read and write.
  - **PHI only in a US cloud region.**
- [ ] **7. Mark the app "Ready for production".**
  - ⚠️ This **locks the settings** — finalise the API list before this step.

### Stage C: Hospital setup and testing

- [ ] **8.** Send the hospital your app name and both client IDs so they can activate the app in their non-prod environment.
- [ ] **9.** Agree on configuration: flowsheet rows, alert rules, In Basket pools, client secret or JWK Set for refresh tokens. Get their non-production FHIR base URL.
- [ ] **10.** Test jointly with test patients. Confirm in writing that the hospital's test environment contains no real PHI.

### Stage D: Go-live and run

- [ ] **11.** Get go-live approvals: BAA, security and privacy review, third-party pen-test report, clinical sign-off.
- [ ] **12.** Production activation: hospital activates your prod client ID, ship the release, run production smoke check.
- [ ] **13.** Run it: monitor API errors and failed writes through PHI-free dashboards. Re-test before every quarterly Epic upgrade.

---

## 4. Data flows to build

| App feature | Direction | Epic API (FHIR R4) | Phase |
|---|---|---|---|
| Sign-in and identity | Epic → app | SMART standalone launch + `Patient.Read` | **1 (mandatory)** |
| Care team, problems, allergies | Epic → app | `Practitioner`/`CareTeam`, `Condition`, `AllergyIntolerance` | 1 |
| Medication list | Epic → app | `MedicationRequest.Search` | 1 |
| Discharge instructions, care plan | Epic → app | `DocumentReference`/`Binary.Read`, `CarePlan.Read` | 1 |
| Upcoming appointments | Epic → app | `Appointment.Search` | 1 |
| **Vitals** (BP, weight, glucose, SpO2, HR) | App → Epic | `Observation.Create` (LOINC) | **2 (highest value)** |
| Post-discharge symptom check-ins | App → Epic | `QuestionnaireResponse` (or flowsheet) | 2 |
| Red-flag symptoms | App → Epic + clinician | Same write + In Basket message or Epic rule | 2 |
| Fluid intake | App → Epic | `Observation.Create` to an agreed flowsheet row | 2 |
| Medication adherence | App → Epic | Questionnaire or flowsheet | 3 |
| Booking consultations | Both | `Appointment $find` / `$book` on Cadence slots | 3 |

---

## 5. Security and compliance items engineering must deliver

| Area | What to build or prepare |
|---|---|
| Hosting | Integration layer and all PHI in a US region (AWS, Azure or GCP) under a cloud BAA |
| Tokens | Server-side only, encrypted, short-lived. Refresh tokens never on the device |
| Encryption | TLS 1.2+ in transit; AES-256 at rest; encrypted local storage on iOS/Android |
| Audit | Log every Epic read and write; keep logs per the hospital's retention policy |
| Least privilege | Request scopes per phase only |
| Data quality | Validation, units and ranges; idempotent writes |
| Testing | Third-party pen test of the app, APIs and integration layer before go-live |
| Subprocessors | BAA with every one: cloud, SMS/push, analytics, any LLM provider |
| Certifications | SOC 2 Type II at minimum; HITRUST is often requested |

---

## 6. Reference: endpoints and a sample call

| What | Link |
|---|---|
| Developer site / app registration | fhir.epic.com |
| API catalogue | fhir.epic.com/Specifications |
| OAuth / SMART guide | fhir.epic.com/Documentation?docId=oauth2 |
| Sandbox test patients and MyChart logins | fhir.epic.com/Documentation?docId=testpatients |
| Sandbox FHIR R4 base | `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/` |
| Sandbox SMART config | `…/api/FHIR/R4/.well-known/smart-configuration` |
| Production endpoint directory | open.epic.com/MyApps/Endpoints |
| Vendor Services (paid, only if needed) | vendorservices.epic.com |
| Showroom (after go-live) | showroom.epic.com |

Sample token exchange (sandbox shape — always take the real token URL from SMART config):

```http
POST https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<code from redirect>
&redirect_uri=<your registered URI>
&code_verifier=<PKCE verifier>
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<JWT signed with your private key>
```

---

## 7. Key gotchas

1. **Every hospital has its own URL** — discover endpoints, never hardcode them
2. **Non-prod and prod client IDs are separate** — sandbox uses non-prod ID
3. **Key propagation is slow** — up to 1 hour in sandbox, 12 hours at a hospital
4. **Patients see a Data Use Questionnaire** on first MyChart connect — this is Epic's consent screen
5. **App freeze** — once marked "Ready for Production", only redirect URLs and key URLs can change
6. **Tokens are PHI keys** — refresh tokens need encryption at rest
7. **Write-back is scrutinised** — writing to the legal medical record requires hospital sign-off
