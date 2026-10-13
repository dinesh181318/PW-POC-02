# Critical Workflow Specification: TrustBank End-to-End Journey

**POC ID:** PW-POC-02  
**Owner:** Dinesh K  
**Primary Workflow:** Login → Dashboard → Add Beneficiary → Transfer Funds → OTP → Receipt → Statement Verification  

---

## 1. End-to-End Workflow Diagram

```mermaid
flowchart TD
    A[Launch TrustBank /apps/bank] --> B[Enter Step 1: Customer ID & Password]
    B --> C[Submit Step 1 & Proceed to Step 2]
    C --> D[Answer Security Question: Greenwood]
    D --> E[Land on Dashboard]
    E --> F[Navigate to Transfer Funds]
    F --> G[Click + New Payee Modal]
    G --> H[Fill Name, Account, Re-enter Account, Valid IFSC]
    H --> I[Save Payee & Verify Dropdown Updated]
    I --> J[Select Source Account, Payee, Amount & IMPS/NEFT]
    J --> K[Click Review Transfer]
    K --> L[Verify Summary & Click Confirm Transfer]
    L --> M[Enter 6-Digit OTP: 246810]
    M --> N[Wait for Processing Indicator]
    N --> O[Generate Receipt & Capture TB Reference ID]
    O --> P[Navigate to Transactions Statement]
    P --> Q[Verify Reference ID, Debit Amount & Description in Dynamic Table]
```

---

## 2. Step-by-Step Business Logic & Validation Points

### Step 1: Two-Step Authentication
- **Entry Criteria:** Target application reachable; unauthenticated browser session.
- **Inputs:** Customer ID: `100200300`, Password: `Bank@123`.
- **Validation:** 
  - Form transitions from Step 1 to Step 2 (`data-testid="security-form"`).
  - Security question rendered ("What was the name of your first school?").
- **Step 2 Input:** Security Answer: `greenwood`.
- **Expected Outcome:** URL changes to `/apps/bank/dashboard`, session timer initialized.

### Step 2: Dashboard Verification
- **Validation:** 
  - Session timer is visible and decrementing.
  - Recent transactions table (`data-testid="recent-transactions"`) loads existing account history rows.
  - Quick action links (Transfer, Add Payee, Statements) present and operational.

### Step 3: Beneficiary Registration
- **Interaction:** Trigger modal via `data-testid="add-payee"`.
- **Inputs:**
  - Payee Name: Dynamic unique name (e.g., `Devika 4321`)
  - Account Number: 10-digit numeric string
  - Re-enter Account: Exact match
  - IFSC Code: 11 characters matching format `^[A-Z]{4}0[0-9]{6}$` (e.g., `TRST0001234`)
- **Negative / Edge Checks:**
  - IFSC format mismatch shows validation error: `IFSC looks like ABCD0123456`.
  - Account mismatch shows validation error: `Account numbers don't match`.
- **Expected Outcome:** Modal closes; new payee option dynamically exists in Payee select element.

### Step 4: Transfer Initiation & Review
- **Inputs:** From Account (Savings), Payee (Newly added beneficiary), Amount (e.g., `750.00`), Remarks (`Tuition Fee`), Mode (`IMPS` or `NEFT`).
- **Validation:**
  - Clicking `Review transfer` displays read-only confirmation modal.
  - Verifies mode, formatted amount with currency symbol (`₹750.00`), and payee name.
  - Edit button enables navigating back to update details without losing entered state.

### Step 5: OTP Authentication & Receipt Generation
- **Inputs:** Click `Confirm`, enter OTP `246810`.
- **Validation:**
  - Incorrect OTP displays `Incorrect OTP. Please try again.` without debiting funds.
  - Correct OTP triggers `data-testid="processing"` status.
  - Receipt appears displaying:
    - Status: `Transfer successful`
    - Dynamic Reference ID matching pattern `TB\d+` (e.g., `TB8530583521`)
    - Debited amount (`₹750.00`)
    - Updated account balance reflecting debit.

### Step 6: Statement & Transaction History Verification
- **Interaction:** Navigate to `/apps/bank/history`.
- **Validation:**
  - Newly created transaction is immediately present at the top of the dynamic history table (`data-testid="history-row"`).
  - Row columns match: Date, Reference ID, Description snippet, Account type, and Debit amount (`−₹750.00`).
  - Search by description filters rows dynamically.
  - Type filters (Credits only vs Debits only) correctly isolate positive and negative line items.
