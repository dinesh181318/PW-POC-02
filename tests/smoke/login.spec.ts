import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';

test.describe('TrustBank - Authentication Smoke Suite', () => {
  test('TC_SMK_01: Verify successful two-step authentication for valid customer', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.goto();

    // Step 1: Customer ID & Password
    await loginPage.fillStep1(
      BankTestData.credentials.validCustomer.customerId,
      BankTestData.credentials.validCustomer.password
    );
    await loginPage.submitStep1();

    // Step 2: Security question prompt
    await expect(loginPage.securityForm).toBeVisible();
    await expect(loginPage.securityQuestion).toBeVisible();

    // Fill security answer and sign in
    await loginPage.fillStep2(BankTestData.credentials.validCustomer.securityAnswer);
    await loginPage.submitStep2();

    // Verify successful landing on dashboard
    await dashboardPage.verifyDashboardLoaded();
  });

  test('TC_SMK_02: Verify session timer is active and customer can log out', async ({
    authenticatedSession,
    loginPage,
  }) => {
    const { dashboardPage } = authenticatedSession;

    // Verify session timer is present in header
    await dashboardPage.header.verifySessionActive();
    await expect(dashboardPage.header.sessionTimer).toContainText(/Session \d{2}:\d{2}/i);

    // Logout and assert redirect back to login page
    await dashboardPage.header.logout();
    await expect(loginPage.loginForm).toBeVisible();
  });
});

