import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';
import { DataGenerator } from '../../utils/data-generator';

test.describe('TrustBank - Regression Suite - Workflow Variations & Filtering', () => {
  test('TC_POS_05: Critical E2E Workflow 2: Transfer funds using NEFT mode to existing payee and verify in statement', async ({
    authenticatedSession,
  }) => {
    const { transferPage, historyPage } = authenticatedSession;

    await transferPage.goto();

    const amount = 1200.0;
    const remarks = DataGenerator.generateRemarks('Vendor payment NEFT');

    await transferPage.fillTransferForm({
      fromAccountIndex: 1, // Savings
      payeeIndex: 1, // Existing payee (Priya Nair)
      amount: amount,
      remarks: remarks,
      mode: 'NEFT',
    });

    await transferPage.clickReviewTransfer();
    await transferPage.verifyReviewDetails({
      mode: 'NEFT',
      amount: amount,
    });

    await transferPage.clickConfirmTransfer();
    const receipt = await transferPage.submitOtpAndCompleteTransfer(
      BankTestData.transfers.validTransfer.otp
    );

    expect(receipt.referenceId).toBeTruthy();
    expect(receipt.amount).toContain('1,200.00');

    // Go to history and verify
    await transferPage.header.goToHistory();
    await historyPage.verifyTransactionPresent(receipt.referenceId);
    await historyPage.search('Vendor payment');
    await historyPage.verifyTransactionPresent(receipt.referenceId);
  });

  test('TC_POS_06: Critical E2E Workflow 3: Transfer funds sourced from Current Account with OTP confirmation and receipt validation', async ({
    authenticatedSession,
  }) => {
    const { transferPage, historyPage } = authenticatedSession;

    await transferPage.goto();

    const amount = 650.0;
    const remarks = DataGenerator.generateRemarks('Current Acc Payment');

    // Select Current account (index 2)
    await transferPage.fillTransferForm({
      fromAccountIndex: 2, // Current account
      payeeIndex: 2, // City Electricity Board
      amount: amount,
      remarks: remarks,
      mode: 'IMPS',
    });

    await transferPage.clickReviewTransfer();
    await transferPage.verifyReviewDetails({
      mode: 'IMPS',
      amount: amount,
    });

    await transferPage.clickConfirmTransfer();
    const receipt = await transferPage.submitOtpAndCompleteTransfer(
      BankTestData.transfers.validTransfer.otp
    );

    expect(receipt.referenceId).toBeTruthy();
    expect(receipt.details).toContain(remarks);

    // Verify presence in transaction ledger
    await transferPage.header.goToHistory();
    await historyPage.verifyTransactionPresent(receipt.referenceId);
  });

  test('TC_POS_07: Edit transfer details from Review screen before OTP confirmation', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    await transferPage.fillTransferForm({
      fromAccountIndex: 1,
      payeeIndex: 1,
      amount: 300.0,
      remarks: 'Initial remark',
      mode: 'IMPS',
    });

    await transferPage.clickReviewTransfer();
    await transferPage.verifyReviewDetails({ amount: 300.0 });

    // Click Edit button to return to form
    await transferPage.editTransferButton.click();
    await expect(transferPage.transferForm).toBeVisible();

    // Modify amount to 450.00
    await transferPage.amountInput.fill('450.00');
    await transferPage.clickReviewTransfer();

    // Verify updated amount is reflected on Review step
    await transferPage.verifyReviewDetails({ amount: 450.0 });
  });

  test('TC_POS_08: Dynamic transaction table filtering by Credits only and Debits only', async ({
    authenticatedSession,
  }) => {
    const { historyPage } = authenticatedSession;

    await historyPage.goto();

    // 1. Filter by Credits only
    await historyPage.filterByType('Credits only');
    const creditRows = await historyPage.getAllRowsText();
    for (const row of creditRows) {
      expect(row).toContain('+₹');
    }

    // 2. Filter by Debits only
    await historyPage.filterByType('Debits only');
    const debitRows = await historyPage.getAllRowsText();
    for (const row of debitRows) {
      expect(row).toContain('−₹');
    }

    // 3. Reset to all
    await historyPage.filterByType('Credits & debits');
    expect(await historyPage.transactionRows.count()).toBeGreaterThan(0);
  });
});
