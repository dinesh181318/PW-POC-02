# Playwright Internal POC: TrustBank Banking Domain (PW-POC-02)

**QA Team – Domain-Specific Automation Proof of Concept**  
- **POC ID:** `PW-POC-02`  
- **Assigned Team Member:** Dinesh K  
- **Domain:** Banking & Financial Services  
- **Target Application:** TrustBank ([https://www.practiceqaautomation.com/apps/bank](https://www.practiceqaautomation.com/apps/bank))  
- **Primary Playwright Focus:** Two-Step Authentication, Account Lockout, Beneficiary Management, OTP Verification, Dynamic Transaction Tables, State & Ledger Validation.

---

## 1. Project Overview & Critical Workflow

TrustBank is a simulated net banking application modeling core financial user journeys:
```
Login (Step 1 + Step 2) ➜ Dashboard ➜ Add Beneficiary ➜ Transfer Funds ➜ Review ➜ OTP ➜ Receipt ➜ Transaction Statement Verification
```

### Key Capabilities Covered:
- **Two-Step Authentication:** Customer ID & Password verification followed by Security Question challenge.
- **Security & Lockout Controls:** 3-attempt brute-force protection, countdown warning messages, input disabling, and unlock reset.
- **Beneficiary Management:** Dynamic payee registration with anti-paste protection, IFSC code regex verification (`^[A-Z]{4}0[0-9]{6}$`), and account number match validation.
- **Fund Transfers:** Account selection, mode selection (IMPS / NEFT / RTGS), review screen with edit capability, and OTP validation (`246810`).
- **Dynamic Ledger & Statements:** Automatic statement entry verification with captured dynamic transaction reference IDs, balance audits, search, and type-based filtering.

---

## 2. Project Architecture & Directory Structure

```
poc-bank-app/
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI GitHub Actions pipeline
├── components/
│   ├── add-payee-modal.component.ts  # Add payee modal component
│   ├── header.component.ts           # App navigation header & session timer
│   └── otp-modal.component.ts        # OTP authentication modal component
├── config/
│   └── environment.ts                # Application configuration & base URLs
├── docs/
│   ├── APPLICATION_DOMAIN_UNDERSTANDING.md # Domain & architecture specs
│   ├── CRITICAL_WORKFLOW.md          # End-to-end workflow documentation
│   └── POC_SUMMARY.md                # Comprehensive POC executive summary
├── fixtures/
│   └── bank-fixtures.ts              # Custom fixtures for POM & authenticated sessions
├── pages/
│   ├── base.page.ts                  # Base Page Object
│   ├── dashboard.page.ts             # Dashboard Page Object
│   ├── history.page.ts               # Statements & Transaction History Page Object
│   ├── login.page.ts                 # Two-Step Login & Lockout Page Object
│   └── transfer.page.ts              # Fund Transfer & Receipt Page Object
├── test-data/
│   └── bank-data.ts                  # Externalized credentials, beneficiaries & transfers
├── tests/
│   ├── negative/
│   │   ├── authentication-lockout.spec.ts # Lockout, countdown & bad security answers
│   │   └── transfer-validation.spec.ts     # IFSC regex, account mismatch, bad OTP
│   ├── regression/
│   │   ├── account-dashboard.spec.ts      # Recent transactions table & shortcuts
│   │   └── e2e-workflow.spec.ts           # NEFT mode, review edits, history filters
│   ├── smoke/
│   │   ├── critical-flow.spec.ts          # Complete E2E business journey
│   │   └── login.spec.ts                  # Two-step login & session logout
│   └── validation/
│       └── business-rules.spec.ts         # Mandatory fields, daily limits, RBAC rules
├── utils/
│   ├── currency-utils.ts             # Rupee currency parsing & formatting
│   └── data-generator.ts             # Dynamic test data generator
├── package.json                      # NPM dependencies & test scripts
├── playwright.config.ts              # Playwright cross-browser configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```

---

## 3. Prerequisites & Installation

### Prerequisites:
- **Node.js:** v18.x or v20.x or higher
- **NPM:** v9.x or higher

### Installation:
```bash
# Clone the repository
git clone https://github.com/dinesh181318/PW-POC-02.git
cd PW-POC-02

# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install --with-deps chromium firefox webkit
```

---

## 4. Test Execution Commands

| Command | Description |
| :--- | :--- |
| `npm test` | Runs the full 23-test suite across all configured browsers in parallel |
| `npm run test:chromium` | Runs all tests using the Chromium browser engine |
| `npm run test:firefox` | Runs all tests using Firefox |
| `npm run test:webkit` | Runs all tests using WebKit (Safari engine) |
| `npm run test:smoke` | Executes the smoke test suite (Login & Critical E2E Flow) |
| `npm run test:regression` | Executes the regression suite (Workflow variations & dashboard) |
| `npm run test:negative` | Executes the negative test suite (Lockout, IFSC, bad OTP) |
| `npm run test:validation` | Executes the business rules and validation suite (Mandatory fields, limits, RBAC) |
| `npm run test:headed` | Executes tests in headed mode for visual observation |
| `npm run test:debug` | Launches Playwright Inspector for step-by-step debugging |
| `npm run report` | Opens the interactive Playwright HTML Execution Report |
| `npm run lint` | Performs strict TypeScript compile-time type checking |

---

## 5. Test Data Management

All test data is externalized in `test-data/bank-data.ts`:
- **Valid Customer ID:** `100200300`
- **Password:** `Bank@123`
- **Security Answer:** `greenwood`
- **Valid OTP:** `246810`
- **Branch Manager ID:** `900800700`
- **Dynamic Generation:** Random 10-digit account numbers and valid IFSC strings (`TBIC0...`) generated via `utils/data-generator.ts` to ensure idempotency.

---

## 6. Continuous Integration (CI) Readiness

The repository includes a ready-to-run GitHub Actions configuration in `.github/workflows/playwright.yml`:
- Triggered on `push` and `pull_request` to `main`/`master` branches or via manual dispatch.
- Performs clean dependency installation (`npm ci`).
- Executes TypeScript static analysis (`npm run lint`).
- Runs Playwright tests with automatic retries and parallel worker allocation.
- Archives Playwright HTML Reports, failure screenshots, traces, and video artifacts with 30-day retention.

---

## 7. Submission Checklist Status

- [x] Application/domain overview completed (`docs/APPLICATION_DOMAIN_UNDERSTANDING.md`)
- [x] Critical workflow documented with 3 full journeys (`docs/CRITICAL_WORKFLOW.md`)
- [x] 23 test scenarios documented and automated (11 Positive, 6 Negative, 6 Validation)
- [x] Playwright project configured (`playwright.config.ts`, `tsconfig.json`, `package.json`)
- [x] Page Objects and reusable components created (`pages/`, `components/`)
- [x] Test data separated from test logic (`test-data/bank-data.ts`, `utils/data-generator.ts`)
- [x] 11 Positive scenarios automated (`tests/smoke/`, `tests/regression/`)
- [x] 6 Negative scenarios automated (`tests/negative/`)
- [x] 6 Validation / Boundary scenarios automated (`tests/validation/`)
- [x] Cross-browser execution verified (Chromium, Firefox, WebKit)
- [x] Reports, trace capture, and failure evidence configured
- [x] README completed with setup, execution, and architectural details
- [x] CI execution pipeline created (`.github/workflows/playwright.yml`)
- [x] POC summary and technical findings documented (`docs/POC_SUMMARY.md`)
- [x] POC walkthrough/demo script prepared (`docs/DEMO_WALKTHROUGH_SCRIPT.md`)
- [x] Positive scenarios automated (`tests/smoke/`, `tests/regression/`)
- [x] Negative and validation scenarios automated (`tests/negative/`)
- [x] Cross-browser execution verified (Chromium, Firefox, WebKit)
- [x] Reports, trace capture, and failure evidence configured
- [x] README completed with setup, execution, and architectural details
- [x] CI execution pipeline created (`.github/workflows/playwright.yml`)
- [x] POC summary and technical findings documented (`docs/POC_SUMMARY.md`)

