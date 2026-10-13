# SMART on FHIR / Epic EHR Integration

A monorepo containing two proof-of-concept projects demonstrating Epic EHR integration via FHIR R4 and SMART on FHIR.

All data used in development is **synthetic**. No real patient data (PHI), production credentials, or production endpoints are present in this repository.

---

## Projects

### [`smart-on-fhir-patient-app`](./smart-on-fhir-patient-app)

A patient-facing React app with an Express gateway demonstrating:

- **Flow A** — SMART on FHIR standalone patient launch (Connect MyChart / OAuth PKCE)
- **Flow C** — Backend services system-to-system JWT authentication
- FHIR R4 reads: Patient, Conditions, Medications, Allergies, Appointments, Observations
- FHIR R4 writes: Vitals (`Observation.Create`), Symptom check-ins (`QuestionnaireResponse`)
- Mock mode — runs without Epic credentials using synthetic patient data

**Stack:** React + Vite (frontend), Node.js + Express (gateway)

---

### [`smart-on-fhir-combined`](./smart-on-fhir-combined)

A full-stack Dockerized POC with a React frontend, Node.js API, and MongoDB demonstrating all three Epic integration flows:

- **Flow A** — Standalone patient launch (SMART on FHIR + PKCE)
- **Flow B** — EHR launch simulator (open from inside Epic Hyperspace)
- **Flow C** — Backend services system-to-system JWT sync
- ePRO survey write-back, vitals write-back, admin sync dashboard
- Demo mode — boots with synthetic data, no Epic credentials required

**Stack:** React + Vite (frontend), Node.js + Express (backend), MongoDB, Docker Compose

---

## Repository structure

```
SMART-on-FHIR-EPIC-EHR/
├── smart-on-fhir-patient-app/   # Flow A + C patient-facing app
│   ├── app/                     # React/Vite frontend
│   └── gateway/                 # Express FHIR gateway
├── smart-on-fhir-combined/      # All three flows, Dockerized
│   ├── frontend/                # React/Vite UI
│   ├── backend/                 # Express API + FHIR client
│   └── spec/                    # Product spec, data flows, decisions
└── docs/                        # Shared documentation
    ├── EPIC-DEV-SUMMARY.md      # Integration checklist and data flows
    ├── EPIC-PRIMER.md           # Epic concepts for developers
    └── epic-integration-docs.md # Reference documentation
```

---

## Quick start

### smart-on-fhir-patient-app (demo mode — no Epic credentials needed)

```bash
# Terminal 1 — Gateway
cd smart-on-fhir-patient-app/gateway
cp .env.example .env
npm install
npm run dev   # http://localhost:3001

# Terminal 2 — React app
cd smart-on-fhir-patient-app/app
npm install
npm run dev   # http://localhost:5173
```

Open `http://localhost:5173` and click **Connect My Health Record**. `MOCK_AUTH=true` is set by default — loads synthetic patient data without Epic credentials.

---

### smart-on-fhir-combined (Docker)

```bash
cd smart-on-fhir-combined
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8080`. The initial view shows `DEMO / SYNTHETIC DATA`.

For local Node development:
```bash
cd smart-on-fhir-combined/backend && npm install && npm run dev
cd smart-on-fhir-combined/frontend && npm install && npm run dev
```

---

## Epic sandbox setup

Both projects support real Epic sandbox mode. See the individual project READMEs and setup guides:

- [`smart-on-fhir-patient-app/README.md`](./smart-on-fhir-patient-app/README.md)
- [`smart-on-fhir-combined/SANDBOX-SETUP.md`](./smart-on-fhir-combined/SANDBOX-SETUP.md)

**Prerequisites for sandbox mode:**
1. Register an app at [fhir.epic.com](https://fhir.epic.com) (Build Apps → Create)
2. Generate an RSA key pair (see setup guides)
3. Host your JWKS endpoint at a publicly reachable HTTPS URL
4. Copy `.env.example` to `.env` and fill in your client ID and key path

---

## Security notes

- `.env` files are excluded from git — copy `.env.example` and fill in your own values
- Private keys (`*.pem`) and `keys/`, `secrets/` directories are excluded from git
- Never commit real client IDs, secrets, or private keys
- All Epic calls go through the backend gateway — the frontend never calls Epic directly
- Tokens are stored server-side only — never in the browser

---

## FHIR resources covered

| Resource | Read | Write |
|---|---|---|
| `Patient` | ✅ | — |
| `Condition` | ✅ | — |
| `MedicationRequest` | ✅ | — |
| `Observation` (vitals + labs) | ✅ | ✅ |
| `AllergyIntolerance` | ✅ | — |
| `Appointment` | ✅ | — |
| `QuestionnaireResponse` | ✅ | ✅ |
| `DocumentReference` | ✅ | — |

---

## Contributing

Other packages in this monorepo are maintained by separate contributors. Each package has its own `README.md` and `.env.example`. Follow the security notes above — no secrets, no PHI, no production endpoints in any commit.

---

## Disclaimer

This is a proof-of-concept for sandbox/development use only. It is not a clinical product, does not provide clinical advice, does not monitor emergencies, and is not approved for use with real patient data. All sample data is synthetic.
