import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';

test.describe('TrustBank - Authentication Smoke Suite', () => {
  test('TC_POS_01: Verify successful two-step authentication for valid customer', async ({
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

    // Step 2: Security question challenge
    await expect(loginPage.securityForm).toBeVisible();
    await expect(loginPage.securityQuestion).toBeVisible();

    // Fill security answer and sign in
    await loginPage.fillStep2(BankTestData.credentials.validCustomer.securityAnswer);
    await loginPage.submitStep2();

    // Verify landing on customer dashboard
    await dashboardPage.verifyDashboardLoaded();
  });

  test('TC_POS_02: Verify successful two-step authentication for Branch Manager role', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();

    // Manager Step 1
    await loginPage.fillStep1(
      BankTestData.credentials.validManager.managerId,
      BankTestData.credentials.validManager.password
    );
    await loginPage.submitStep1();

    // Manager Step 2
    await expect(loginPage.securityForm).toBeVisible();
    await loginPage.fillStep2(BankTestData.credentials.validManager.securityAnswer);
    await loginPage.submitStep2();

    // Verify Manager lands on approvals portal
    await expect(page).toHaveURL(/.*\/apps\/bank\/approvals/);
    await expect(page.getByTestId('page-title')).toContainText('Transfers awaiting approval');
  });

  test('TC_POS_03: Verify session timer is active, session extension works, and customer can log out', async ({
    authenticatedSession,
    loginPage,
  }) => {
    const { dashboardPage } = authenticatedSession;

    // Verify session timer is present in header
    await dashboardPage.header.verifySessionActive();
    await expect(dashboardPage.header.sessionTimer).toContainText(/Session \d{2}:\d{2}/i);

    // Click Extend session and verify active status maintained
    await dashboardPage.header.extendSession();
    await expect(dashboardPage.header.sessionTimer).toBeVisible();

    // Logout and assert redirect back to login page
    await dashboardPage.header.logout();
    await expect(loginPage.loginForm).toBeVisible();
  });
});
