# FHIR API Map — Epic Sandbox Endpoints & Resource Shapes
> Reference for all FHIR calls made in the POC.
> Sandbox base: https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4

---

## Discovery Endpoint
```
GET https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/.well-known/smart-configuration
```
Returns: `authorization_endpoint`, `token_endpoint`, `scopes_supported`

---

## OAuth Endpoints (from discovery)
```
Authorization: https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize
Token:         https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
```

---

## READ Operations

### Patient
```
GET {base}/Patient/{id}
GET {base}/Patient?identifier={mrn}
```
Key fields: `id`, `name[0].text`, `birthDate`, `identifier[].value` (MRN), `gender`

### Conditions (Diagnoses)
```
GET {base}/Condition?patient={id}&clinical-status=active
```
Key fields: `code.coding[0].display` (SNOMED name), `onsetDateTime`, `clinicalStatus.coding[0].code`

### Medications
```
GET {base}/MedicationRequest?patient={id}&status=active
```
Key fields: `medicationCodeableConcept.text`, `dosageInstruction[0].text`, `status`

### Observations (Vitals + Labs)
```
GET {base}/Observation?patient={id}&category=vital-signs&_sort=-date&_count=20
GET {base}/Observation?patient={id}&category=laboratory&_sort=-date&_count=20
```
Key fields: `code.coding[0].display`, `valueQuantity.value`, `valueQuantity.unit`, `effectiveDateTime`

### Allergies
```
GET {base}/AllergyIntolerance?patient={id}
```
Key fields: `code.coding[0].display`, `criticality`, `reaction[0].manifestation[0].coding[0].display`

### Appointments
```
GET {base}/Appointment?patient={id}&status=booked&_sort=date&_count=5
```
Key fields: `start`, `serviceType[0].coding[0].display`, `participant[].actor.display`

---

## WRITE Operations

### QuestionnaireResponse (ePRO Survey)
```
POST {base}/QuestionnaireResponse
Content-Type: application/fhir+json
Authorization: Bearer {token}
```
Body:
```json
{
  "resourceType": "QuestionnaireResponse",
  "status": "completed",
  "subject": {
    "reference": "Patient/{patientId}"
  },
  "authored": "2026-10-07T14:30:00Z",
  "item": [
    {
      "linkId": "fatigue",
      "text": "Fatigue level today (0-10)",
      "answer": [{ "valueInteger": 7 }]
    },
    {
      "linkId": "pain-level",
      "text": "Pain level today (0-10)",
      "answer": [{ "valueInteger": 3 }]
    },
    {
      "linkId": "pain-location",
      "text": "Pain location",
      "answer": [{ "valueString": "lower back" }]
    },
    {
      "linkId": "nausea",
      "text": "Nausea",
      "answer": [{ "valueCoding": { "code": "mild", "display": "Mild" } }]
    },
    {
      "linkId": "appetite",
      "text": "Appetite",
      "answer": [{ "valueCoding": { "code": "reduced", "display": "Reduced" } }]
    },
    {
      "linkId": "mood",
      "text": "Mood",
      "answer": [{ "valueCoding": { "code": "neutral", "display": "Neutral" } }]
    },
    {
      "linkId": "new-symptoms",
      "text": "Any new symptoms?",
      "answer": [{ "valueString": "" }]
    }
  ]
}
```
Expected response: `HTTP 201 Created` with `Location` header containing resource ID

### Observation — Blood Pressure
```
POST {base}/Observation
```
Body:
```json
{
  "resourceType": "Observation",
  "status": "final",
  "category": [{
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs" }]
  }],
  "code": {
    "coding": [{ "system": "http://loinc.org", "code": "85354-9", "display": "Blood pressure panel" }]
  },
  "subject": { "reference": "Patient/{patientId}" },
  "effectiveDateTime": "2026-10-07T08:00:00Z",
  "component": [
    {
      "code": { "coding": [{ "system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure" }] },
      "valueQuantity": { "value": 120, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]" }
    },
    {
      "code": { "coding": [{ "system": "http://loinc.org", "code": "8462-4", "display": "Diastolic blood pressure" }] },
      "valueQuantity": { "value": 80, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]" }
    }
  ]
}
```

### Observation — Single Value (Weight, HR, Temp, SpO2)
```json
{
  "resourceType": "Observation",
  "status": "final",
  "category": [{ "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs" }] }],
  "code": { "coding": [{ "system": "http://loinc.org", "code": "29463-7", "display": "Body weight" }] },
  "subject": { "reference": "Patient/{patientId}" },
  "effectiveDateTime": "2026-10-07T08:00:00Z",
  "valueQuantity": { "value": 72.5, "unit": "kg", "system": "http://unitsofmeasure.org", "code": "kg" }
}
```

---

## LOINC Codes Reference

| Vital | LOINC Code | Unit |
|---|---|---|
| Blood pressure panel | 85354-9 | — (use components) |
| Systolic BP | 8480-6 | mm[Hg] |
| Diastolic BP | 8462-4 | mm[Hg] |
| Heart rate | 8867-4 | /min |
| Body weight | 29463-7 | kg |
| Body temperature | 8310-5 | Cel |
| Oxygen saturation | 59408-5 | % |
| PROMIS Fatigue | 89243-0 | score |

---

## Backend Services (Flow C) — JWT Auth

### Key Generation (run once)
```bash
node scripts/generate-keys.js
# Creates: keys/private.pem, keys/public.pem
# Upload public.pem to fhir.epic.com app registration
```

### JWT Structure
```json
{
  "iss": "80858d9b-8377-4a7b-907c-fa9a56fa4e49",
  "sub": "80858d9b-8377-4a7b-907c-fa9a56fa4e49",
  "aud": "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
  "jti": "<unique UUID>",
  "exp": "<now + 4 minutes>"
}
```
Signed with RS384 algorithm using private key.

### Token Request
```
POST https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion={signed_jwt}
```

---

## Sandbox Test Patient IDs

These are Epic's pre-built synthetic patients. IDs are stable in the sandbox.

| Name | FHIR ID | Notes |
|---|---|---|
| Camila Lopez | `erXuFYUfucBZaryVksYEcMg3` | General adult |
| Derrick Lin | `eq081-VQEgP8drUUqCWzHfw3` | Has oncology data |
| Jason Argonaut | `Tbt3KuCY0B5PSrJvCu2j-PlK` | Classic test patient |

Full list: https://fhir.epic.com/Documentation?docId=testpatients
