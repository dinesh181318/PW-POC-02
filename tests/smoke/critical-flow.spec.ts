import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';
import { DataGenerator } from '../../utils/data-generator';

test.describe('TrustBank - Critical Workflow E2E Smoke Suite', () => {
  test('TC_POS_04: Critical E2E Workflow 1: Complete banking journey (Login → Dashboard → Add Beneficiary → Transfer Funds → OTP → Receipt → Statement Verification)', async ({
    loginPage,
    dashboardPage,
    transferPage,
    historyPage,
  }) => {
    // 1. Authenticate via Two-Step Login
    await loginPage.goto();
    await loginPage.login(
      BankTestData.credentials.validCustomer.customerId,
      BankTestData.credentials.validCustomer.password,
      BankTestData.credentials.validCustomer.securityAnswer
    );

    // 2. Validate Dashboard landing
    await dashboardPage.verifyDashboardLoaded();

    // 3. Navigate to Fund Transfer
    await dashboardPage.header.goToTransfer();

    // 4. Add a new Beneficiary
    const newPayeeName = DataGenerator.generateBeneficiaryName('Devika');
    const newAccountNumber = DataGenerator.generateAccountNumber();
    const validIfsc = DataGenerator.generateValidIfsc('TRST');

    await transferPage.openAddPayeeModal();
    await transferPage.addPayeeModal.fillPayeeDetails({
      name: newPayeeName,
      accountNumber: newAccountNumber,
      ifsc: validIfsc,
    });
    await transferPage.addPayeeModal.saveSuccessfully();

    // 5. Fill Transfer Form with the new Beneficiary
    const transferAmount = 750.0;
    const transferRemark = DataGenerator.generateRemarks('Tuition Fee');

    await transferPage.fillTransferForm({
      fromAccountIndex: 1, // Savings account
      payeeName: newPayeeName,
      amount: transferAmount,
      remarks: transferRemark,
      mode: 'IMPS',
    });

    // 6. Review Transfer Details
    await transferPage.clickReviewTransfer();
    await transferPage.verifyReviewDetails({
      mode: 'IMPS',
      amount: transferAmount,
      payeeSnippet: newPayeeName,
    });

    // 7. Confirm Transfer and Enter OTP
    await transferPage.clickConfirmTransfer();
    const receipt = await transferPage.submitOtpAndCompleteTransfer(
      BankTestData.transfers.validTransfer.otp
    );

    // 8. Assert Receipt Details
    expect(receipt.referenceId).toMatch(/^TB\d+/);
    expect(receipt.amount).toContain('750.00');
    expect(receipt.details).toContain(transferRemark);
    expect(receipt.newBalance).toContain('₹');

    // 9. Navigate to Transactions / Statement & Verify Persistence
    await transferPage.header.goToHistory();
    await historyPage.verifyTransactionPresent(receipt.referenceId);
    await historyPage.verifyTransactionDetails({
      referenceId: receipt.referenceId,
      amount: '−₹750.00',
      descriptionSnippet: transferRemark,
    });
  });
});

