

---

# 📄 Epic & Healthcare Crash Course  ΓÇö NYC Hospital Meeting Prep.docx

---

# Epic & Healthcare Crash Course — NYC Hospital Meeting Prep
Oct 6, 2026 · @Dikshith Rai
## Read this first: 10 things to know cold
If you only have 30 minutes, read this section, then the glossary tables (sections 3, 4, 6), then the discovery questions at the end. The hospital will judge you on whether you speak Epic fluently and respect how tightly Epic controls its ecosystem.
- Epic is the EHR (electronic health record) of record at almost every major NYC system. You don't replace Epic; you build around and inside it. Saying "we'll replace your workflows" ends the meeting.
- Epic's AI is now a direct competitor. Epic ships its own AI assistants: Art (clinicians), Emmie (patients, inside MyChart) and Penny (revenue cycle), plus Agent Factory for building custom agents. Over 85% of Epic customers use Epic AI. Your pitch must answer "why not just wait for Epic?"
- Data lives in three layers: Chronicles (live operational database), Clarity (nightly SQL reporting copy) and Caboodle (data warehouse). Analytics/AI projects almost always start from Clarity or Caboodle, not Chronicles.
- Integration = HL7 v2 + FHIR APIs. HL7 v2 messages (ADT, ORM, ORU) still move most real-time data; FHIR R4 APIs are the modern, regulated path for apps. SMART on FHIR is how an app launches inside Epic.
- Third-party apps go through Epic's developer program (open.epic, the Epic Showroom marketplace, "Connection Hub" listings). Expect the hospital to ask "are you on Showroom?"
- PHI + HIPAA + BAA are non-negotiable. Any vendor touching patient data signs a Business Associate Agreement. Offshore access to PHI (India delivery) is a real procurement question; have an answer ready.
- The money side is revenue cycle (RCM): charge capture, coding (ICD-10, CPT), claims, denials, prior authorization. Hospitals feel denial and prior-auth pain acutely; it is the easiest ROI story.
- Clinician burnout and documentation time are the #1 clinical pain. Ambient AI scribes are the hot category (Epic's Art, Microsoft Dragon Copilot, Abridge).
- Regulation drives budgets: 21st Century Cures Act (information blocking), TEFCA, CMS prior-auth API rule (CMS-0057-F, APIs due January 2027), and in New York, the SHIN-NY health information exchange.
- Epic "analysts" and "builders" are the hospital's own staff who configure Epic. Your project competes for their time; offering to reduce their workload is a strong card.
## Epic 101: the company and how hospitals run it
Epic Systems is a private company in Verona, Wisconsin, founded by Judy Faulkner in 1979; it won every large health-system EHR selection in the KLAS 2026 market share report and gained 77 hospitals, while Oracle Health (formerly Cerner) lost 56. Epic is never acquired, never sells to investors, and is famously controlling of its ecosystem.
How a hospital owns Epic
- One patient, one record: every department (ED, inpatient, clinics, pharmacy, billing) works on the same Epic database. That integration is why hospitals pick it.
- Hosting: either on the hospital's own servers or Epic-hosted in the cloud (Epic's hosting and its newer Nebula cloud platform for AI and analytics features).
- Upgrades: Epic now ships releases roughly every 3 months (it used to be ~18), per UGM 2026 coverage. Hospitals plan around upgrade freezes; avoid proposing go-lives during one.
- Community Connect: a big system extends its Epic instance to smaller affiliated hospitals and practices. NYC systems use this to bring partners onto their Epic.
- Care Everywhere: Epic's built-in network that exchanges records between Epic (and non-Epic) organizations.
People and roles you'll hear about
Epic's lingo: Epic calls hospitals "customers" or "organizations", and a configuration change is a "build". A "Nova note" is release documentation, and "Foundation System" is Epic's recommended default build.
## Epic modules glossary
Epic names every module, and staff use the names constantly; knowing which module a pain point lives in is how you sound credible. The ones a NYC academic hospital will mention most are EpicCare, ASAP, OpTime, Resolute, Beaker, MyChart and Cogito.
Clinical
Access and revenue cycle
Patient and population
Data and analytics
## Epic data and integration stack
Outside software talks to Epic in two supported ways, HL7 v2 messages and FHIR APIs, and analytics run on nightly copies of the live database. Knowing this map is what separates a credible vendor from one the CIO's team will screen out.

Epic data and integration architecture
The live database (Chronicles) is protected; apps go through FHIR or HL7, and data science works from Clarity, Caboodle or a cloud copy.
## Epic's AI in 2026, and where third parties fit
Epic is building AI into every workflow and moving fast: it says Epic AI assists 1.4 million clinicians a month and over 85% of customers use it (Healthcare IT News, UGM 2026; Fierce Healthcare, HIMSS26). Any AI pitch to an Epic hospital will be compared against this roadmap.
What this means for a vendor like CodeCraft
- Don't compete head-on with Art, Emmie or Penny on their core jobs. Hospitals will default to Epic because it is integrated and already paid for.
- Play in the gaps: specialty-specific workflows Epic hasn't reached, operational AI outside the EHR (staffing, supply chain, call centres, contracts), data engineering on Clarity/Caboodle, building and governing agents on Agent Factory, evaluation and safety testing of AI, and integration with non-Epic systems.
- AI governance is a hot topic. Health systems now run AI governance committees that validate models for bias, accuracy and drift. Offering monitoring and validation is a credible, low-risk entry.
- Competing third-party AI they may already use: Microsoft Dragon Copilot (formerly Nuance DAX), Abridge, Ambience (ambient scribes); Waystar, R1 RCM, AKASA (revenue cycle); Hippocratic AI (patient voice agents).
## Core healthcare terminology
US hospital vocabulary splits into four buckets: clinical care, operations, revenue cycle and quality. The money and quality terms are where executives live; clinical terms are where the CMIO lives.
Clinical and care settings
Operations
Revenue cycle (RCM)
Quality and value
## Regulation and compliance
Compliance is the first filter on any vendor: expect security questionnaires, a BAA and questions about offshore PHI access before any technical discussion. The rules below are the ones most likely to come up.
New York specifics
- SHIN-NY (Statewide Health Information Network for New York): the state's network of regional HIEs (Healthix and Bronx RHIO in NYC) that hospitals must connect to.
- NY hospital cybersecurity regulation (10 NYCRR 405.46): requires hospitals to have a CISO, a cybersecurity program and to report incidents to the NY Department of Health within 72 hours. Vendors get pulled into these reviews.
- NY SHIELD Act: state data-security and breach law on top of HIPAA.
- NY Medicaid is a large payer in NYC, especially for public hospitals, so Medicaid workflows and SDOH matter.
Offshore delivery (important for CodeCraft): HIPAA doesn't ban offshore work, but many hospital contracts and some Medicaid rules restrict PHI leaving the US. Lead with a model of US-hosted data, de-identified dev and test data, and India teams working without production PHI access, unless the client approves otherwise.
## NYC hospital landscape
Every major NYC health system now runs Epic, so the customer you're meeting almost certainly does; the main difference is how long they've been on it. Mature Epic shops want optimization and AI on top; recent converts like Northwell are still stabilizing and short on analyst bandwidth.
Open question: which hospital is it, and is it part of one of these systems? That decides whether you're talking to a central IT team with its own AI group (NYU, Mount Sinai) or a site team that has to route decisions upward.
## Who's in the room and what they care about
Tailor every answer to the person asking: clinicians care about time and safety, IT about integration and Epic support, finance about dollars, compliance about risk.
Tip: hospital buying cycles are slow (often 6–18 months) and run through committees. Aim tomorrow for a scoped, low-risk pilot or a discovery workshop, not a full contract.
## Where CodeCraft can play
Position CodeCraft as the engineering partner that builds what Epic doesn't, on Epic's standards, with governance built in. Lead with outcomes and one or two concrete use cases, not with a capabilities list.
Suggested positioning line: "We're an AI-native engineering team that extends your Epic investment: we build and govern AI and data products on top of Epic's APIs and your Clarity/Caboodle data, so your Epic team doesn't carry the load."
Credibility gaps to address honestly: US healthcare references, Epic Showroom status, HITRUST/SOC 2, US presence. If you lack them, propose a partner model (e.g. with a US Epic consulting firm) or a de-identified-data pilot.
## Discovery questions and phrases to avoid
Ask more than you pitch: good questions show Epic fluency faster than any slide.
Questions to ask
- How long have you been on Epic, and are you Epic-hosted or self-hosted? Any big upgrades or go-lives coming?
- Which Epic AI features are you live on or piloting (Art, Emmie, Penny)? Where have they fallen short?
- How does your AI governance committee evaluate new tools? What did the last approved vendor go through?
- Where does your analytics team work today: Clarity, Caboodle, a cloud warehouse? Is Cosmos used for research?
- What are your top three revenue-cycle pain points: denials, prior auth, coding backlog, A/R days?
- How are you preparing for the January 2027 prior-auth API requirements?
- Where do clinicians lose the most time: In Basket, documentation, orders, alerts?
- What does your integration stack look like (engine, FHIR usage, SMART apps)?
- How much capacity does your Epic analyst team have this year?
- What would a successful 90-day pilot look like to you, and who signs off?
Phrases to avoid
- "Replace Epic" or "rip and replace": you'll be shown out.
- "We'll scrape the Epic screen" or "direct database writes to Chronicles": both are unsafe and unsupported. Say "FHIR APIs, HL7 and Clarity".
- "EMR" vs "EHR": both are used; "EHR" is the current term.
- "Users" for clinicians: say clinicians, providers, nurses.
- Overclaiming clinical accuracy ("our AI diagnoses"): say "supports clinicians", "human in the loop".
- "Patients' data in India": say "US-hosted data; offshore teams work on de-identified data".
Bring with you: one-page data-flow diagram, a security summary (encryption, hosting region, certifications), two relevant case studies (GCC healthcare or any regulated industry), and a pilot proposal with success metrics.
## Sources
- Healthcare IT News: Epic bets on AI speed at UGM 2026
- Fierce Healthcare: HIMSS26, Epic expands AI roadmap, previews Factory
- HIT Consultant: KLAS 2026 EHR market share report
- This Week Health: Epic launches Showroom
- CMS fact sheet: Interoperability and Prior Authorization Final Rule (CMS-0057-F)
- Becker's: How Northwell's $1.2B Epic rollout is progressing
- Becker's: Which EHRs do US News honor roll hospitals use?
- Becker's: NYC Health + Hospitals live on Epic at 19 more facilities
Module names, terminology and NY regulatory notes come from general knowledge; confirm any figure you plan to quote in the meeting.

| Term | What it means |
| --- | --- |
| Epic analyst / application analyst | Hospital IT staff who configure an Epic module; usually Epic-certified |
| Epic certification / proficiency | Training from Epic itself; only customers and some consultants can get it, which is a barrier for outside vendors |
| Physician builder | A doctor trained to build their own templates, order sets, SmartPhrases |
| CMIO / CNIO | Chief Medical / Nursing Information Officer: the clinician who owns how Epic is used clinically |
| Epic TS (Technical Services) | Epic's own staff assigned to the customer |
| Go-live / activation | The day a new module or site switches on |
| UGM / XGM | Epic's annual Users Group Meeting (August, Verona) and Expert Group Meetings (spring) |

| Module | What it does |
| --- | --- |
| EpicCare Inpatient ("ClinDoc") | Inpatient nursing and physician documentation, flowsheets, MAR (medication administration record) |
| EpicCare Ambulatory | Outpatient clinic charting, orders, e-prescribing |
| ASAP | Emergency department |
| OpTime | Operating rooms / surgery scheduling and documentation; Anesthesia is its partner module |
| Willow | Pharmacy (inpatient and ambulatory) |
| Beaker | Laboratory (clinical and anatomic pathology) |
| Radiant | Radiology |
| Cupid | Cardiology (cath lab, echo) |
| Beacon | Oncology / chemotherapy protocols |
| Stork | Labor and delivery, obstetrics |
| Kaleidoscope | Ophthalmology |
| Wisdom | Dental |
| Rover / Haiku / Canto / Limerick | Mobile apps: nursing (Rover), physician phone (Haiku), iPad (Canto), Apple Watch (Limerick) |
| Hyperspace / Hyperdrive | The clinician desktop application; Hyperdrive is the current web-based version |
| BPA (Best Practice Advisory) | Pop-up clinical decision support alerts; "alert fatigue" comes from these |
| SmartTools (SmartPhrase, SmartText, SmartSet) | Templates and shortcuts clinicians use to write notes faster (e.g. ".HPI") |
| In Basket | Clinician inbox for results, messages, refill requests; a major burnout driver |

| Module | What it does |
| --- | --- |
| Cadence | Outpatient scheduling |
| Prelude | Registration, insurance verification |
| Grand Central | Bed management, ADT (admit/discharge/transfer), patient flow |
| Resolute HB / PB | Hospital billing / professional (physician) billing |
| Tapestry | Managed care / payer functions (used where the system has a health plan) |
| Claims / Remittance | Claim submission and payment posting |

| Module | What it does |
| --- | --- |
| MyChart | Patient portal and app (325M users per Epic); messaging, scheduling, bills, results |
| Welcome | Waiting-room kiosks and check-in |
| Healthy Planet | Population health, care management, value-based contracts |
| Compass Rose | Care coordination for social needs |
| Care Everywhere | Record exchange with other organizations |

| Module | What it does |
| --- | --- |
| Cogito | The analytics umbrella: reporting, dashboards, Clarity, Caboodle, SlicerDicer |
| Reporting Workbench | Real-time operational reports run from Chronicles |
| Radar | In-Epic dashboards |
| SlicerDicer | Self-service population queries for clinicians and researchers |
| Cosmos | Epic's de-identified dataset across customers (320M patient records) |

| Term | What it is | Say it like this |
| --- | --- | --- |
| Chronicles | Epic's live operational database (built on InterSystems IRIS/Caché, a non-relational database) | "We won't touch Chronicles directly" |
| Clarity | Nightly extract into Microsoft SQL Server or Oracle; thousands of tables | "We'd source from Clarity" |
| Caboodle | Epic's data warehouse (star schema) that can blend non-Epic data | "Or Caboodle, if that's your enterprise warehouse" |
| HL7 v2 | Older pipe-delimited messaging standard; still carries most real-time feeds | ADT (admit/discharge/transfer), ORM (orders), ORU (results), SIU (scheduling), DFT (charges) |
| Bridges | Epic's interface module that sends and receives HL7 | "Do you have an outbound ADT feed via Bridges?" |
| Integration engine | Middleware routing HL7 between systems: Rhapsody, InterSystems HealthShare, Infor Cloverleaf, Mirth | "Which engine do you run?" |
| FHIR R4 | Modern REST/JSON healthcare API standard; US Core and USCDI define required data | "Standards-based, read and write through FHIR" |
| SMART on FHIR | OAuth 2.0-based way to launch an app inside Epic with the patient in context | "Embedded in the clinician workflow, single sign-on" |
| CDS Hooks | Standard for an outside service to show advice at a point in the workflow (e.g. when signing an order) | "Advice inside the workflow, not a separate screen" |
| Interconnect | Epic's web-services server that exposes FHIR and proprietary APIs |  |
| Backend services (system-to-system) | OAuth flow for server apps with no user, e.g. bulk data | "FHIR Bulk Data export for population analytics" |
| open.epic | Epic's public developer site with API documentation; sandbox access is free |  |
| Epic Showroom | Epic's third-party marketplace, launched Jan 2024, replacing App Orchard (This Week Health) | Listings: Connection Hub (integrated product listing), Toolbox (Epic-recommended integration categories), Workshop (co-development with Epic) |
| Vendor Services | Epic's paid program giving vendors deeper API access and documentation |  |
| Care Everywhere / Epic Nexus | Record exchange between organizations; Epic Nexus is Epic's TEFCA network (QHIN) |  |
| X12 EDI | Standard for claims (837), remittance (835), eligibility (270/271) |  |
| DICOM | Imaging standard; images live in the PACS, not in Epic |  |

| Epic AI | For whom | What it does | Proof points Epic cites |
| --- | --- | --- | --- |
| Art (Chart with Art, Ask Art) | Clinicians | Ambient scribe, chart summaries, chat with the chart, differential-diagnosis check, inpatient insights | 60+ orgs on Chart with Art; discharge summaries 20–30% faster |
| Emmie (Ask Emmie, Schedule with Emmie) | Patients, in MyChart | Conversational help with scheduling, bills, visit prep | Rush: 58% fewer billing inquiries; Schedule with Emmie due Oct 2026 |
| Penny | Revenue cycle staff | Coding help, denial appeal letters, prior-auth submissions | Summit Health: 42% faster prior-auth submissions |
| Agent Factory | Hospital IT | Visual platform to build, deploy and monitor custom AI agents inside Epic workflows | Previewed at HIMSS26 |
| Curiosity / Cosmos models | Clinicians, researchers | Medical foundation models trained on Cosmos data to predict the next clinical events | 20 customers validating |
| Ergo | Platform | Epic's healthcare AI platform underneath these | Announced 2025, now live |

| Term | Meaning |
| --- | --- |
| Inpatient vs outpatient (ambulatory) | Admitted overnight vs clinic or same-day visit |
| Observation status | Patient in a bed but not formally admitted; billed as outpatient, a frequent dispute with payers |
| ED / ER | Emergency department |
| ICU, step-down, med-surg | Intensive care, intermediate care, general medical-surgical floors |
| Attending, resident, fellow, hospitalist | Senior physician, doctor in training, specialist in training, inpatient-only physician |
| APP | Advanced practice provider: nurse practitioner (NP) or physician assistant (PA) |
| H&P, progress note, discharge summary | Admission note, daily note, the note written at discharge |
| Orders, CPOE | Instructions for tests, meds, procedures; computerized provider order entry |
| Order set | Pre-built bundle of orders for a condition (e.g. sepsis) |
| Problem list, med rec | Patient's active diagnoses; medication reconciliation at transitions |
| Sepsis, readmission, LOS | Top clinical/operational metrics: infection response, 30-day return, length of stay |

| Term | Meaning |
| --- | --- |
| ADT | Admit, discharge, transfer events; the heartbeat of hospital data feeds |
| Patient throughput / flow | Moving patients from ED to bed to discharge; "boarding" = waiting in ED for a bed |
| Capacity command center | Central team managing beds and transfers in real time |
| Census | Number of patients currently admitted |
| No-show rate, access, template | Missed appointments, how fast patients get seen, a provider's schedule layout |
| Contact center | Patient call centre; a common AI target |

| Term | Meaning |
| --- | --- |
| Revenue cycle | Everything from scheduling to final payment |
| Payer | Insurer: Medicare, Medicaid, commercial (UnitedHealthcare, Aetna, Empire BCBS, etc.) |
| ICD-10-CM / PCS | Diagnosis codes / inpatient procedure codes |
| CPT / HCPCS | Procedure and service codes for billing |
| DRG (MS-DRG) | Inpatient payment group; one fixed payment per stay |
| CDI | Clinical documentation integrity: making notes support the right codes |
| Charge capture, CDM | Recording billable items; the hospital's chargemaster price list |
| Claim, 837 / 835 | Bill sent to payer / remittance (payment) file (X12 EDI standards) |
| Denial, appeal | Payer refuses a claim; the hospital fights it |
| Prior authorization (PA) | Payer approval needed before a service |
| A/R days | Days revenue sits unpaid; a core CFO metric |
| Price transparency | Federal rule requiring hospitals to publish prices |

| Term | Meaning |
| --- | --- |
| CMS | Centers for Medicare & Medicaid Services: sets most payment and reporting rules |
| Value-based care, ACO | Payment tied to outcomes and cost; accountable care organizations |
| HEDIS, eCQMs | Quality measures reported to payers and CMS |
| HCAHPS | Patient-experience survey that affects payment and star ratings |
| Leapfrog, US News, CMS Star Ratings | Public quality rankings executives watch |
| SDOH | Social determinants of health: housing, food, transport |
| Joint Commission | Accrediting body that surveys hospitals |
| Magnet | Nursing excellence designation |

| Rule | What it requires | Why it matters to you |
| --- | --- | --- |
| HIPAA Privacy & Security Rules | Protect PHI (protected health information); minimum-necessary access; safeguards and audit logs | Everything you build must be HIPAA-compliant; de-identified data (Safe Harbor or Expert Determination) is far easier to work with |
| BAA (Business Associate Agreement) | Contract making a vendor legally liable for PHI it handles | You will sign one; it covers your subcontractors too (cloud, LLM provider) |
| HITECH / breach notification | Breaches must be reported; large penalties | Drives tough security reviews (SOC 2 Type II, HITRUST certification are common asks) |
| 21st Century Cures Act: information blocking | Providers and EHRs may not unreasonably block access to electronic health information | Underpins patients' and apps' right to FHIR API access |
| ONC/ASTP certification (HTI-1 and later rules) | Certified EHRs must offer FHIR R4 APIs (US Core, USCDI) and transparency on predictive AI ("decision support interventions") | Why Epic exposes standard FHIR APIs; AI in the EHR needs documented source attributes |
| TEFCA | National framework for exchange between QHINs (Epic Nexus is one) | Long-term direction of nationwide data sharing |
| CMS-0057-F (Interoperability & Prior Authorization) | Payers must answer prior auth in 72 hours (urgent) / 7 days (standard) now; Prior Authorization, Provider Access and Payer-to-Payer FHIR APIs by January 1, 2027; hospitals attest to electronic prior auth from 2027 (CMS fact sheet) | Live budget item for 2026–27: electronic prior auth (Da Vinci CRD/DTR/PAS FHIR standards) |
| 42 CFR Part 2 | Extra protection for substance-use-disorder treatment records | Data segmentation is required in some workflows |
| FDA SaMD | Some clinical AI counts as a medical device | Shapes whether a clinical AI tool needs FDA clearance |

| System | EHR | What to know |
| --- | --- | --- |
| NewYork-Presbyterian | Epic | Academic (Columbia, Weill Cornell); large, mature Epic and innovation programs (Becker's) |
| NYU Langone Health | Epic | Long-time Epic customer, known for heavy in-house data science and AI work (Becker's) |
| Mount Sinai Health System | Epic | Academic (Icahn School of Medicine); strong AI and data science department (Becker's) |
| Northwell Health | Epic (converting from Allscripts/Veradigm) | $1.2B rollout across 28 hospitals; wave 1 live Nov 2025 (8 hospitals), wave 2 scheduled May 2026 (9 hospitals), wave 3 later in 2026 (Becker's) |
| NYC Health + Hospitals | Epic | Largest US public health system; Medicaid and uninsured-heavy; public procurement rules (Becker's) |
| Montefiore Einstein | Epic | Bronx academic system; large Medicaid population, strong SDOH focus |

| Role | Cares about | Win them with |
| --- | --- | --- |
| CIO / CDO (Chief Information / Digital Officer) | Epic stability, total cost, vendor sprawl, cybersecurity | "Fits inside Epic, uses standard APIs, reduces apps we maintain" |
| CMIO / CNIO | Clinician burnout, alert fatigue, patient safety, adoption | Minutes saved per clinician per day; fewer clicks; clinician co-design |
| CFO / VP Revenue Cycle | Denials, A/R days, cost to collect, margin | Hard-dollar ROI: denial rate down X%, recovered revenue |
| COO / VP Operations | Throughput, LOS, ED boarding, staffing | Capacity and flow metrics |
| Chief AI / Data Officer, data science lead | Model validation, governance, data access (Clarity/Caboodle) | Rigorous evaluation, bias monitoring, MLOps maturity |
| CISO / Privacy Officer | PHI exposure, BAA, SOC 2/HITRUST, NY 72-hour reporting | Clear data-flow diagram, US hosting, no PHI offshore |
| Epic application analysts / Epic team lead | Their backlog and upgrade calendar | "We take work off your plate; no custom build in Chronicles" |
| Procurement / Supply chain | Contract terms, vendor risk, pricing model | Transparent pricing; small pilot first |

| Use case | Pain it solves | Epic touchpoints | Watch-out |
| --- | --- | --- | --- |
| Denial prediction and appeal automation | Lost revenue, rework | Clarity claims/remit data, Resolute work queues | Overlaps with Penny; position as complementary or for payers Penny doesn't cover |
| Prior-auth readiness for CMS-0057-F | 2027 compliance, staff time | FHIR, Da Vinci CRD/DTR/PAS | Epic is shipping CRD; focus on payer-specific rules and analytics |
| Data platform modernization | Slow reporting, siloed data | Clarity/Caboodle to Snowflake/Databricks/Azure/AWS | Requires the hospital's Epic data team; security review |
| Contact-center and patient-access AI | Call volume, no-shows | Cadence, MyChart, FHIR scheduling APIs | Overlaps with Emmie; target voice/phone and non-MyChart users |
| Operational AI (capacity, staffing, OR utilization) | ED boarding, overtime, idle ORs | ADT feeds, OpTime, Grand Central | Strong ROI; needs real-time HL7 feeds |
| AI governance and model monitoring | Regulatory and safety risk of AI | Model output from Epic and third parties | Low clinical risk, high strategic value; good first pilot |
| Custom agents on Epic Agent Factory / SMART on FHIR apps | Specialty workflows Epic hasn't built | Agent Factory, SMART on FHIR, CDS Hooks | Needs Epic developer program access (Showroom/Vendor Services) |
| Non-Epic system integration | Research, imaging, devices, ERP (Workday, Oracle) | HL7, FHIR, integration engines (Rhapsody, Cloverleaf, Mirth) | Hospital's integration team owns the engine |


---

# 📄 Epic Integration Runbook _ Patient Care & W ellness  App-API integration with EPIC.docx

---

# Epic Integration Runbook — Patient Care & Wellness App
Oct 6, 2026 · @Dikshith Rai
## Goal and scope
We are connecting our Patient Care & Wellness App (iOS, Android, web) to Montefiore Einstein's Epic so data flows both ways before go-live, using Epic's free developer site (fhir.epic.com) and standard FHIR R4 APIs. Paid Epic Vendor Services is only needed if Montefiore's Epic team confirms a must-have API isn't available on the free site.
- Epic → app: patient sign-in via MyChart, medications, problems, allergies, appointments, discharge instructions.
- App → Epic: patient-entered vitals, fluid intake and symptom check-ins into flowsheets; red-flag values trigger alerts that Montefiore configures inside Epic.
- Not in scope for now: booking through Epic APIs (deep-link to MyChart scheduling instead) and summary documents.
- Ground rules: apps never call Epic directly; everything goes through our US-hosted integration layer. The India team works only on sandbox or de-identified data.
Full context, data-flow table and roadmap: Montefiore Epic Integration Plan.
## Key links and endpoints
Bookmark these; everything in the checklist below points back here.
Montefiore's non-production and production FHIR base URLs come from their Epic team (step 9) and the endpoint directory (step 12).
## Step-by-step checklist
Thirteen steps in four stages; steps 1–7 need only our team, and Montefiore's Epic team joins from step 8. Tick each box as it's done.
Stage A · Register with Epic (our team)
- ☐ 1. Prepare what Epic asks for: legal company name (ideally our US entity), app name and description, logo, public privacy policy and terms-of-use URLs, redirect URIs for the integration layer, and a JWK Set URL hosting our public keys.
- ☐ 2. Create a developer account on fhir.epic.com (Sign Up) with a company email; this account owns the app record.
- ☐ 3. Create the app record (Build Apps → Create):
- Audience: Patients.
- Select APIs: Patient.Read, MedicationRequest.Search, AllergyIntolerance.Search, Condition.Search, Appointment.Search, DocumentReference.Search, Observation.Create (vitals), and any others from the data-flow table. Note any API marked unavailable and flag it to the lead.
- SMART on FHIR version R4; client type confidential (credentials live in our gateway, never on the phone).
- Turn on persistent access (refresh tokens).
- Add non-production and production redirect URIs and JWK Set URLs.
- ☐ 4. Save and record both client IDs (non-production and production) in our secrets manager. The non-production ID works in the sandbox immediately.
Stage B · Build against the sandbox (our team)
- ☐ 5. Build the Epic connection:
- Read the SMART configuration URL to get the authorize and token endpoints.
- Implement standalone launch: authorization code flow with PKCE; scopes such as openid fhirUser launch/patient offline_access patient/*.read plus the specific write scopes.
- Sign in with sandbox MyChart test users from the test-patients page; read their records; file test vitals with Observation.Create.
- ☐ 6. Build the integration layer: token vault, FHIR client, mapping of app values to Epic codes and units, validation, idempotent writes with retry, full audit log. PHI only in a US cloud region.
- ☐ 7. Mark the app "ready for production" in the app record. Settings lock here; later changes need a new app version, so finalise API selection first.
Stage C · Montefiore setup and testing (with Montefiore's Epic team)
- ☐ 8. Send Montefiore's Epic team our app name and both client IDs so they can download/activate the app in their non-production environment.
- ☐ 9. Agree Montefiore's configuration: flowsheet rows that accept our patient-entered values, alert rules and In Basket pools for red-flag values, client secret or JWK Set for refresh tokens in their environment. Get their non-production FHIR base URL.
- ☐ 10. Joint testing in Montefiore's test environment with test patients, then clinician user-acceptance testing of how data appears in the chart.
Stage D · Go-live and run (both)
- ☐ 11. Go-live approvals: BAA, security and privacy review, pen-test report, clinical sign-off.
- ☐ 12. Production activation: Montefiore activates our production client ID; point the gateway at Montefiore's production base URL from the endpoint directory; start the pilot cohort.
- ☐ 13. Run it: monitor API errors and failed writes, re-test before each quarterly Epic upgrade, list on Showroom's Connection Hub once live.
## Sample sign-in call and engineering notes
After the patient signs in with MyChart, the gateway swaps the returned code for a token; this is the sandbox shape of that call.
POST https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<code from redirect>
&redirect_uri=<our registered URI>
&code_verifier=<PKCE verifier>
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<JWT signed with our private key>
- Don't hard-code the token URL: take it from each hospital's SMART configuration; the URL above is the commonly used sandbox one and must be verified there.
- The token response includes the patient's Epic FHIR ID; later calls go to {base}/Patient/{id}, {base}/Observation, and so on.
- Check API availability first: whether an API is offered on the free site shows when selecting APIs in step 3. Anything unavailable goes to the lead before build.
- Sandbox data only: never put real patient data in the Epic sandbox; Epic may remove it.
- Exact API names and versions vary by Epic release; confirm each on the API catalogue and with Montefiore's Epic team.

| What | Link |
| --- | --- |
| Developer site (sign up, app registration) | fhir.epic.com |
| API catalogue (every FHIR API, request/response specs) | fhir.epic.com/Specifications |
| OAuth 2.0 / SMART guide, client IDs, auto-sync rules | fhir.epic.com/Documentation?docId=oauth2 |
| Sandbox test patients and MyChart test logins | fhir.epic.com/Documentation?docId=testpatients |
| Sandbox FHIR R4 base URL | https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/ |
| Sandbox SMART configuration (authorize and token URLs) | https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/.well-known/smart-configuration |
| Production endpoint directory (search "Montefiore") | open.epic.com/MyApps/Endpoints |
| Same directory, machine-readable (SMART brands bundle) | open.epic.com/Endpoints/Brands |
| Vendor Services (paid, only if needed) | vendorservices.epic.com |
| Showroom / Connection Hub (after go-live) | showroom.epic.com |
| Standards | SMART App Launch · US Core |


---

# 📄 Montefiore Epic Integration Plan ΓÇö Patient Ca re & Wellness App- Integration with EPIC.docx

---

# Montefiore Epic Integration Plan — Patient Care & Wellness App
Oct 6, 2026 · @Dikshith Rai
## Recommendation at a glance
Integrate through Epic's standard FHIR R4 APIs, run as a Montefiore-sponsored project rather than a cold vendor submission, in four phases over roughly 6–9 months. Start read-only, then switch on write-back one data type at a time, with Montefiore's clinicians deciding what lands in the chart.
- Patients sign in with MyChart (SMART on FHIR standalone launch), so the app is tied to the right Epic patient record and Montefiore's existing identity and consent.
- Epic → app (read): demographics, care team, medications, allergies, problems, upcoming appointments, discharge instructions.
- App → Epic (write): patient-entered vitals and readings into flowsheets, symptom check-ins as questionnaires, and a periodic summary document. Only clinically useful, reviewed data goes into the chart; raw workout and food logs stay in the app.
- Scheduling uses Montefiore's Epic Cadence slots through Epic scheduling APIs, not your own calendar, so there is one source of truth.
- Alerts to clinicians (worrying symptoms after discharge) go to Epic In Basket via a message or a flowsheet-triggered rule, never only to your web dashboard.
- Build an integration layer between the app and Epic (a FHIR gateway service hosted in the US), so mobile apps never call Epic directly.
The key early step is not technical: get a named Montefiore sponsor (the CMIO's office or digital health team) and their Epic interface team assigned, because they control which APIs are switched on for your app.
## Data flows: what moves which way
Not every feature should write to Epic: clinicians want a few reviewed, structured signals in the chart, not daily food logs. Use this table in the first workshop with Montefiore to agree, feature by feature, what flows and who reviews it.
Exact API names and versions vary by Epic release; confirm every one on fhir.epic.com and with Montefiore's Epic interface team before build. Write APIs need Montefiore to activate them for your client ID.
## Architecture
Put a US-hosted integration layer between your apps and Epic: it holds the Epic tokens, maps app data to Montefiore's flowsheet rows, retries safely and logs every call. This also lets you onboard a second Epic hospital later by changing configuration, not the apps.

Target architecture: app, integration layer, Montefiore Epic
Clinicians never leave Epic: everything they need to see arrives as flowsheet values, questionnaire results or In Basket messages.
## Access path: Epic registration and Montefiore approvals
Epic access has two gates: register the app with Epic, then have Montefiore switch it on in their Epic. The second gate is the slow one, and only Montefiore can open it.
- Register on Epic's developer site (fhir.epic.com, free): create the app as patient-facing, choose the APIs from the data-flow table, set redirect URIs. Epic issues a non-production and a production client ID.
- Build and test in Epic's public sandbox with synthetic patients. Read APIs work here; some write and scheduling APIs are limited, so plan for testing in Montefiore's environment too.
- Decide whether you need Epic Vendor Services (paid, annual): it gives deeper documentation, more APIs and testing support. For a single-customer, sponsored build, the hospital can often support you instead; ask Montefiore's Epic team which they prefer.
- Montefiore sponsorship: their Epic team activates your client ID, maps your writes to specific flowsheet rows and questionnaires, configures In Basket pools and Cadence visit types, and connects you to their non-production (POC/TST) environment.
- Montefiore governance: expect a security review, privacy review, BAA, clinical sign-off on what enters the chart, and possibly their digital health or AI governance committee.
- Production activation after joint testing, then a limited pilot cohort.
- Optional, later: list on Epic Showroom (Connection Hub) if you want to sell the app to other Epic hospitals.
Patient-facing apps that only read standard USCDI data are easier to enable, because patients have a legal right of access under the Cures Act. Writing into the chart always needs the hospital's explicit setup.
## Phased plan
Go live in about 8–9 months by proving read-only first, then adding write-back only after Montefiore's clinicians sign off on what enters the chart. The week ranges are estimates; Montefiore's Epic team capacity and review cycles will set the real pace.

Phased roadmap · 5 phases, 4 gates
Each gate is a go/no-go decision with Montefiore; nothing writes to production Epic before gate 3.
## Security, HIPAA and offshore delivery controls
Connecting to Epic raises the bar from "HIPAA-compliant app" to "trusted system writing into the medical record", so Montefiore's security review will look at the integration layer, not just the app. Have these ready before the review.
Offshore controls (India team)
- Engineers in India build and test against Epic's sandbox and de-identified or synthetic data only.
- No standing production PHI access from India; production support uses a US-based person or break-glass access approved by Montefiore, logged and time-limited.
- Managed devices, VPN, VDI or bastion access, MFA, and background checks for anyone touching the project.
- State the model explicitly in the contract so Montefiore's privacy office can approve it once.
## How Indian offshore firms typically work with US health systems
The common model is onsite-offshore: a small US-based team owns the client relationship, clinical workshops and anything touching production PHI, while India-based teams do most engineering on de-identified data. Large firms (Infosys, TCS, Cognizant, Wipro, HCLTech) and mid-size specialists (CitiusTech, Persistent Systems) all work this way.
For CodeCraft: you already have the strongest card, a working app built for Montefiore. Add a US-based engagement lead or partner, an Epic-experienced integration architect (contract or partner firm), and the offshore controls above, and you look like an established offshore health-tech partner.
## Risks and open questions for Montefiore
The biggest risk is not technical: Epic's own MyChart features (Care Companion care plans, Apple Health and Google Health Connect syncing of readings into flowsheets, MyChart scheduling) cover part of what your app does. Montefiore will ask why they need both, so answer it before they do.
Questions to ask Montefiore
- ☐ Who is our executive sponsor and who on the Epic team owns our interface?
- ☐ Which MyChart features (Care Companion, device syncing, open scheduling) are live today?
- ☐ Which patient cohort starts the pilot (e.g. heart failure, post-surgical, cardiac rehab)?
- ☐ Which data should enter the chart, into which flowsheets, and who reviews it?
- ☐ Where should alerts go (In Basket pool, nurse navigator team) and within what response time?
- ☐ Which visit types and providers can be self-scheduled from the app?
- ☐ Do you want us on Epic Vendor Services, or will your team support us directly?
- ☐ What does your security and privacy review require, and is offshore development on de-identified data acceptable?
- ☐ What success metrics define the pilot (readmissions, no-shows, patient engagement, nurse time)?
## Sources
- Epic on FHIR developer site (API catalogue, sandbox, app registration)
- Mindbowser: How to integrate a health app with Epic (registration and launch types)
- Vital: Epic on FHIR application (example of a Showroom-listed app and hospital-side enablement)
- This Week Health: Epic launches Showroom
API names, timelines and offshore-model norms are general industry practice; confirm specific APIs with Montefiore's Epic team.

| App feature | Direction | Epic mechanism (FHIR R4 unless noted) | Lands in Epic as | Recommendation |
| --- | --- | --- | --- | --- |
| Patient sign-in and identity | Epic → app | SMART on FHIR standalone launch with MyChart login; Patient.Read | Links app user to Epic MRN | Phase 1, mandatory |
| Care team, problems, allergies | Epic → app | Practitioner/CareTeam, Condition, AllergyIntolerance .Read/.Search | n/a | Phase 1 |
| Medication list | Epic → app | MedicationRequest.Search | n/a | Phase 1: seed the app's medication tracker from Epic instead of manual entry |
| Medication adherence (taken / missed) | App → Epic | Questionnaire response or flowsheet row | Patient-entered data for clinician review | Phase 3; send exceptions and weekly adherence %, not every dose |
| Discharge instructions, care plan | Epic → app | DocumentReference / Binary.Read, CarePlan.Read | n/a | Phase 1: drives the post-hospitalization symptom plan |
| Upcoming appointments | Epic → app | Appointment.Search | n/a | Phase 1 |
| Booking consultations | Both | Epic scheduling APIs (Appointment $find / $book) against Cadence slots | Real Cadence appointment | Phase 3; needs Montefiore to open specific visit types and slots |
| Vitals (BP, weight, glucose, SpO2, heart rate) | App → Epic | Observation.Create (vital signs) | Patient-entered flowsheet rows, flagged for review | Phase 2: highest clinical value |
| Fluid intake | App → Epic | Observation.Create to an agreed flowsheet row | Intake flowsheet | Phase 2 only for heart failure / renal patients where clinicians want it |
| Post-discharge symptom check-ins | App → Epic | QuestionnaireResponse (or flowsheet) | Questionnaire result in chart | Phase 2: core use case |
| Red-flag symptoms (e.g. chest pain, breathlessness) | App → Epic + clinician | Same write + In Basket message or Epic rule on the filed value | In Basket alert to care team | Phase 2, with agreed escalation protocol and response times |
| Workout and food logs | Stays in app | Optional periodic summary via DocumentReference.Create | Summary note / PDF in Media | Phase 4, only if clinicians ask for it |
| Secure messaging with care team | Both | Prefer linking to MyChart messaging; custom messaging only if Montefiore agrees | In Basket | Avoid building a parallel inbox clinicians must watch |

| Area | What to have in place |
| --- | --- |
| Hosting | PHI and the integration layer in a US cloud region (AWS, Azure or GCP) under a cloud BAA |
| Contracts | BAA with Montefiore; BAAs with every subprocessor (cloud, SMS/push, analytics, any LLM) |
| Tokens | Epic OAuth tokens stored server-side only, encrypted, short-lived; refresh tokens never on the device |
| Encryption | TLS 1.2+ in transit; AES-256 at rest; encrypted local storage on iOS/Android |
| Audit | Log every read and write to Epic (who, what, when) and keep logs per Montefiore's retention policy |
| Least privilege | Request only the FHIR scopes each phase needs; add scopes per phase |
| Data quality | Validation, units and ranges before any write; idempotent writes so retries never duplicate chart data |
| Certifications | SOC 2 Type II at minimum; HITRUST is often requested by NYC academic systems |
| Testing | Third-party penetration test of app, APIs and integration layer before go-live |
| Incident response | Plan that meets Montefiore's notice terms and supports NY's 72-hour hospital cyber-reporting rule |

| Element | How it usually works |
| --- | --- |
| Legal entity | A US subsidiary signs the contract and BAA; the Indian entity is a subcontractor under a downstream BAA |
| Team shape | US: engagement lead, solution architect, often an Epic-certified analyst. India: developers, QA, DevOps, data engineers |
| Overlap hours | 2–4 hours of daily overlap with US Eastern time; India team often shifts to 12:30–21:30 IST |
| Commercial models | Fixed-price pilot, then time-and-materials or a dedicated team; product licences (SaaS per member per month) for owned apps like yours |
| Epic expertise | Usually hired as US contractors or through partner Epic consulting firms, since Epic certification needs customer sponsorship |
| Entry route | Pilot sponsored by one department (e.g. cardiology, post-discharge care) → success metrics → enterprise rollout |
| Proof required | SOC 2 / HITRUST, US references, insurance (cyber and professional liability, typically several million dollars of cover) |

| Risk | Mitigation |
| --- | --- |
| Overlap with MyChart Care Companion and native device syncing | Position on what Epic doesn't do well: richer daily coaching, workout/nutrition/fluid tracking, a better post-discharge experience, analytics for the care team. Ask which MyChart features Montefiore has switched on |
| Montefiore Epic team has no capacity | Get them to name an interface analyst early; ask for a fixed weekly slot; do all mapping prep yourselves |
| Write APIs not activated or limited | Phase plan works read-only first; writes added one at a time |
| Clinicians overwhelmed by patient data | Write only agreed data types; flag out-of-range values; clear protocol for who watches alerts and when |
| Liability for missed red-flag symptoms | Written escalation protocol, "not for emergencies, call 911" messaging, response-time expectations signed off by clinical leads |
| Epic upgrades break integration | Regression test suite against Montefiore's test environment before each quarterly upgrade |
| Patients without MyChart accounts | Support MyChart sign-up from the app, or a proxy/caregiver flow |