# POC Demo & Walkthrough Script: TrustBank (PW-POC-02)

**Presenter:** Dinesh K  
**Assignment ID:** `PW-POC-02`  
**Domain:** Banking & Financial Services  
**Application:** TrustBank  
**Target URL:** [https://www.practiceqaautomation.com/apps/bank](https://www.practiceqaautomation.com/apps/bank)  
**Estimated Demo Time:** 8–10 Minutes  

---

## 1. Demo Agenda & Flow

```
1. Introduction & Domain Objectives (1 min)
2. Architecture & Design Principles (2 mins)
3. Live Walkthrough: Critical End-to-End Business Flow (3 mins)
4. Highlight: Negative Scenarios, Account Lockout & Security (2 mins)
5. Test Execution Evidence, HTML Report & CI Pipeline (1 min)
6. Key Technical Challenges & Q&A (1 min)
```

---

## 2. Step-by-Step Presentation Script

### Part 1: Introduction (1 Minute)
> *"Hello everyone, I'm Dinesh K. Today I'm presenting the Playwright automation Proof of Concept for TrustBank (POC ID: PW-POC-02) in the Banking domain.*
>
> *The objective of this project was to establish a scalable, maintainable automation framework rather than script-only test routines. Banking applications require rigorous integrity checks around authentication, transaction non-repudiation, beneficiary registration, and statement reconciliation. Today I will walk through the framework architecture, demonstrate the critical end-to-end journey, and show our negative and security test coverage."*

---

### Part 2: Architecture & Design Decisions (2 Minutes)
> *"Let's take a quick look at how the project is structured:*
>
> 1. **Page Object Model + Component Decomposition:**
>    - Full pages are modeled under `pages/` (`LoginPage`, `DashboardPage`, `TransferPage`, `HistoryPage`).
>    - Reusable interactive widgets are separated into `components/` (`AddPayeeModalComponent`, `OtpModalComponent`, `HeaderComponent`). This prevents locator duplication across pages.
>
> 2. **Custom Playwright Fixtures (`fixtures/bank-fixtures.ts`):**
>    - Instead of initializing page objects in every test file, we built custom fixtures that inject page objects automatically.
>    - We also created an `authenticatedSession` fixture that executes login once for regression suites, avoiding redundant authentication overhead.
>
> 3. **Resilient Locators & Auto-Waiting:**
>    - Zero brittle XPaths or CSS hierarchies. We utilize Playwright's `getByTestId()` and `getByRole()`.
>    - Web-first assertions (`expect(locator).toBeVisible()`) auto-wait for DOM animations and network requests without arbitrary `page.waitForTimeout()` sleeps.
>
> 4. **Test Data Management (`test-data/` & `utils/`):**
>    - Credentials and static configurations are strictly externalized in `test-data/bank-data.ts`.
>    - Dynamic values (random account numbers, valid IFSC codes, unique beneficiary names) are generated at runtime via `DataGenerator` to ensure test independence."*

---

### Part 3: Live Walkthrough: Critical End-to-End Flow (3 Minutes)

**Command to Run for Live Demo:**
```bash
npx playwright test tests/smoke/critical-flow.spec.ts --project=chromium --headed
```

**Talking Points while the Browser Executes:**
> 1. **Two-Step Authentication:**
>    - *"The test navigates to TrustBank and enters Customer ID `100200300` and Password `Bank@123`."*
>    - *"Notice that the application does not navigate away—it transitions in-place to Step 2 asking a security question: 'What was the name of your first school?'. The framework enters `greenwood` and asserts landing on the Dashboard."*
>
> 2. **Dashboard & Session Monitoring:**
>    - *"On the dashboard, we assert the session timer is active and decrementing (`Session mm:ss`) and verify recent transactions."*
>
> 3. **Beneficiary Registration:**
>    - *"The test navigates to Transfer Funds and opens the '+ New Payee' modal. Notice that pasting is blocked by the application—our script simulates native keystrokes, fills a dynamic name, 10-digit account number, and valid IFSC (`TRST0001234`), then asserts the modal cleanly detaches and updates the payee dropdown."*
>
> 4. **Transfer Initiation & Review Summary:**
>    - *"The script selects the newly added payee, enters ₹750.00, selects IMPS mode, and clicks 'Review transfer'. We validate that the summary accurately reflects the payee, mode, and formatted amount."*
>
> 5. **Two-Step OTP & Receipt:**
>    - *"Clicking 'Confirm' triggers the OTP modal. We submit OTP `246810`. The framework waits for the 'Processing...' spinner to resolve and validates the receipt."*
>    - *"Crucially, our framework dynamically extracts the generated Reference ID (e.g. `TB8530583521`) and asserts that the new balance reflects the deduction."*
>
> 6. **Statement Ledger Audit:**
>    - *"Finally, the test navigates to the Transactions ledger and verifies that our exact Reference ID and debit amount appear right at the top of the dynamic history table."*

---

### Part 4: Negative Scenarios, Security & Lockout (2 Minutes)

**Command to Run:**
```bash
npx playwright test tests/negative/ --project=chromium
```

**Talking Points:**
> *"In a banking application, negative and boundary validations are as critical as happy paths. Here is what we automated:*
>
> 1. **Brute-Force Lockout (`authentication-lockout.spec.ts`):**
>    - *Attempt 1 & 2: We assert the countdown warnings ('2 attempts left', '1 attempt left').*
>    - *Attempt 3: We verify account lockout triggered ('Your login is locked after 3 failed attempts'), assert the Customer ID input is disabled, and test the administrative unlock reset.*
>    - *Step 2: We test rejection of an incorrect security answer ('That answer doesn't match our records').*
>
> 2. **Transfer & Payee Validation (`transfer-validation.spec.ts`):**
>    - *IFSC Format: Entering an invalid IFSC triggers 'IFSC looks like ABCD0123456'.*
>    - *Account Mismatch: Confirms error 'Account numbers don't match'.*
>    - *Bad OTP: Submitting an invalid OTP shows 'Incorrect OTP. Please try again.' and prevents funds transfer."*

---

### Part 5: Execution Evidence, HTML Report & CI (1 Minute)

**Command to Run:**
```bash
npm run report
```

**Talking Points:**
> *"Playwright generates an interactive HTML report. You can see:
> - Full test breakdown: 14 tests across Smoke, Regression, and Negative suites.
> - Detailed step-by-step logs, action timelines, screenshots, and network logs.
> - Traces are retained for failures to enable instantaneous root-cause debugging.
> - We have also executed and passed cross-browser runs on Chromium, Firefox, and WebKit.
> - CI Readiness: We created a GitHub Actions workflow `.github/workflows/playwright.yml` that runs on every push and pull request with 30-day artifact retention."*

---

### Part 6: Key Technical Challenges & Takeaways (1 Minute)
> *"During exploratory validation, we distinguished several key application behaviors:*
> 1. **Indian Currency Formatting:** *The application formats amounts with commas (e.g., `₹1,200.00`). We built `CurrencyUtils` with locale support so our numerical assertions never produce false positives.*
> 2. **History Search Scope:** *We discovered that the transaction search input filters exclusively by description tokens rather than reference IDs, which we documented and accounted for in our test design.*
> 3. **Modal Overlay Interception:** *We ensured modal close actions assert element detachment to prevent pointer events from being intercepted.*
>
> *In conclusion, the POC meets 100% of the deliverables and acceptance criteria. Thank you, and I welcome any questions!"*

---

## 3. Quick Reference: Demo Cheatsheet

| Question Anticipated | Answer / Code Reference |
| :--- | :--- |
| **How do you prevent flaky tests with dynamic data?** | We use `DataGenerator.generateBeneficiaryName()` and `generateValidIfsc()` with timestamps. No hardcoded names clash across runs. |
| **Why not store authentication state globally for all tests?** | For regression tests, we use the `authenticatedSession` fixture. For negative and lockout tests, we deliberately start with clean, isolated sessions to verify the login state machine. |
| **How do you handle cross-browser differences?** | Desktop configurations are defined in `playwright.config.ts` using `devices['Desktop Chrome']`, `devices['Desktop Firefox']`, and `devices['Desktop Safari']`. |
| **Where are the CI workflows maintained?** | In `.github/workflows/playwright.yml`, running parallel workers and publishing HTML reports as artifacts. |
