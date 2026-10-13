# Application & Domain Understanding: TrustBank Net Banking

**POC ID:** PW-POC-02  
**Assigned Member:** Dinesh K  
**Domain:** Banking & Financial Services  
**Application:** TrustBank  
**Target Environment:** [https://www.practiceqaautomation.com/apps/bank](https://www.practiceqaautomation.com/apps/bank)  

---

## 1. Domain Background & Regulatory Context
Retail banking web applications provide self-service portals for customers to manage accounts, execute electronic funds transfers (EFT), maintain beneficiaries, and audit transactional ledgers. Because financial transactions represent immutable value exchange and sensitive personal identifiable information (PII), banking applications impose rigorous compliance, security, and integrity controls:
- **Two-Factor / Two-Step Authentication (2FA/MFA):** Separation between credential proof (Customer ID + Password) and knowledge proof (Security Question / OTP).
- **Brute-Force & Lockout Controls:** Strict rate limiting on consecutive failed credentials to prevent dictionary and credential stuffing attacks.
- **Payee / Beneficiary Whitelisting:** Strict validation of bank clearing identifiers (e.g., IFSC codes formatted as 4 alphabetic characters, digit '0', and 6 alphanumeric branch identifiers) and account number double-entry confirmation.
- **Transfer Mode Rules:**
  - **IMPS (Immediate Payment Service):** Instant round-the-clock clearance.
  - **NEFT (National Electronic Funds Transfer):** Batch/settlement clearance.
  - **RTGS (Real-Time Gross Settlement):** High-value clearing (typically minimum threshold rules).
- **Non-Repudiation & Audit Trail:** Generation of a unique alphanumeric transaction reference ID upon OTP completion and automated ledger entry into statement history.

---

## 2. Target Application Modules & Capabilities

| Module | Purpose | Key Business Interactions |
| :--- | :--- | :--- |
| **Authentication & Session** | Secure customer entry & session lifecycle management | Two-step authentication, attempt countdown counter, 3-attempt account lockout, unlock reset, active session countdown timer, explicit logout. |
| **Dashboard** | Customer asset view & recent account activity | Summary cards for Savings & Current accounts, quick-action shortcuts (Transfer, Add Payee, Statements), dynamic recent transactions table. |
| **Beneficiary Management** | Registration of trusted external recipients | Modal form with anti-paste security, account confirmation match verification, IFSC regex verification (`^[A-Z]{4}0[A-Z0-9]{6}$`). |
| **Fund Transfer** | Fund movement between accounts | Account source selection, payee selection, amount & remarks entry, transfer mode toggle (IMPS/NEFT/RTGS), transfer review confirmation modal. |
| **Two-Step OTP Validation** | Payment non-repudiation and transaction approval | 6-digit one-time password prompt, client/server validation, processing status indicator. |
| **Transaction Receipt** | Proof of execution and customer balance update | Transaction reference ID, debited amount, timestamp/mode summary, updated remaining balance, receipt download. |
| **Statement & History Ledger** | Audit trail and historical reconciliation | Dynamic table with pagination, account filter (Savings/Current), type filter (Credits/Debits), date range filter, description search, CSV export. |

---

## 3. User Roles & Personas

1. **Retail Account Holder (`100200300` / `Bank@123` / Security: `greenwood` / OTP: `246810`):**
   - Holds primary Savings and Current accounts.
   - Executes routine fund transfers up to daily limit (₹50,000).
   - Adds and manages beneficiaries.
2. **Branch Manager (`900800700` / `Bank@123`):**
   - High-privilege role used for approvals and administrative audit capabilities.
3. **Buggy Build Mode (`100200399`):**
   - Purpose-built test target with seeded defects for exploratory bug hunting.

