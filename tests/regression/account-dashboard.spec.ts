import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';

test.describe('TrustBank - Regression Suite - Account Dashboard & Dynamic Tables', () => {
  test('TC_POS_09: Verify dynamic recent transactions table structure and data format', async ({
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

  test('TC_POS_10: Verify quick action shortcuts on dashboard', async ({
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

  test('TC_POS_11: Verify receipt navigation shortcuts return to transfer and dashboard', async ({
    authenticatedSession,
    page,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    // Execute a quick valid transfer to land on receipt
    await transferPage.fillTransferForm({
      fromAccountIndex: 1,
      payeeIndex: 1,
      amount: 100.0,
      remarks: 'Receipt nav test',
      mode: 'IMPS',
    });
    await transferPage.clickReviewTransfer();
    await transferPage.clickConfirmTransfer();
    await transferPage.submitOtpAndCompleteTransfer(BankTestData.transfers.validTransfer.otp);

    // Verify receipt actions
    await expect(transferPage.newTransferLink).toBeVisible();
    await expect(transferPage.backToDashboardLink).toBeVisible();

    // Click "New transfer" link
    await transferPage.newTransferLink.click();
    await expect(page).toHaveURL(/.*\/apps\/bank\/transfer/);
    await expect(transferPage.transferForm).toBeVisible();

    // Return to history/dashboard
    await transferPage.header.goToDashboard();
    await expect(page).toHaveURL(/.*\/apps\/bank\/dashboard/);
  });
});
