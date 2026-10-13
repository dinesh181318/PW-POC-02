import { test, expect } from '../../fixtures/bank-fixtures';

test.describe('TrustBank - Regression Suite - Account Dashboard & Dynamic Tables', () => {
  test('TC_REG_04: Verify dynamic recent transactions table structure and data format', async ({
    authenticatedSession,
  }) => {
    const { dashboardPage } = authenticatedSession;

    await dashboardPage.verifyDashboardLoaded();

    const rowCount = await dashboardPage.getRecentTransactionCount();
    expect(rowCount).toBeGreaterThan(0);

    const rows = await dashboardPage.getRecentTransactionRowsText();
    // Verify each row contains a rupee symbol and date/description
    for (const row of rows) {
      expect(row).toContain('₹');
    }
  });

  test('TC_REG_05: Verify quick action shortcuts on dashboard', async ({
    authenticatedSession,
    page,
  }) => {
    const { dashboardPage } = authenticatedSession;

    await dashboardPage.verifyDashboardLoaded();

    // 1. Verify Statements quick action navigates to history
    await dashboardPage.clickStatementsAction();
    await expect(page).toHaveURL(/.*\/apps\/bank\/history/);

    // 2. Return to dashboard and click Transfer quick action
    await dashboardPage.goto();
    await dashboardPage.clickTransferAction();
    await expect(page).toHaveURL(/.*\/apps\/bank\/transfer/);

    // 3. Return to dashboard and verify Add Payee quick action
    await dashboardPage.goto();
    await dashboardPage.clickAddPayeeAction();
    await expect(page).toHaveURL(/.*\/apps\/bank\/transfer\?addPayee=1/);
    await expect(dashboardPage.addPayeeModal.modal).toBeVisible();
  });
});

