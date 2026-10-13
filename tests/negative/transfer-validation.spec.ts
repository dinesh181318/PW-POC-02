import { test, expect } from '../../fixtures/bank-fixtures';
import { DataGenerator } from '../../utils/data-generator';

test.describe('TrustBank - Negative Suite - Payee & Transfer Validation', () => {
  test('TC_NEG_04: Reject invalid IFSC format when adding beneficiary', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();
    await transferPage.openAddPayeeModal();

    await transferPage.addPayeeModal.fillPayeeDetails({
      name: DataGenerator.generateBeneficiaryName('InvalidIfsc'),
      accountNumber: '9876543210',
      confirmAccountNumber: '9876543210',
      ifsc: 'INVALID_IFSC', // Invalid format
    });

    await transferPage.addPayeeModal.save();

    // Verify IFSC error message
    await transferPage.addPayeeModal.verifyIfscError('IFSC looks like ABCD0123456');
    // Ensure modal remains open
    expect(await transferPage.addPayeeModal.isVisible()).toBe(true);
  });

  test('TC_NEG_05: Reject mismatched account numbers when adding beneficiary', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();
    await transferPage.openAddPayeeModal();

    await transferPage.addPayeeModal.fillPayeeDetails({
      name: DataGenerator.generateBeneficiaryName('Mismatch'),
      accountNumber: '1122334455',
      confirmAccountNumber: '9988776655', // Mismatched
      ifsc: 'TRST0001234',
    });

    await transferPage.addPayeeModal.save();

    // Verify account mismatch error
    await expect(transferPage.addPayeeModal.confirmAccountError).toBeVisible();
    await expect(transferPage.addPayeeModal.confirmAccountError).toContainText(
      "Account numbers don't match"
    );
  });

  test('TC_NEG_06: Reject incorrect OTP during fund transfer verification', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    await transferPage.fillTransferForm({
      fromAccountIndex: 1,
      payeeIndex: 1,
      amount: 200.0,
      remarks: 'Negative OTP test',
      mode: 'IMPS',
    });

    await transferPage.clickReviewTransfer();
    await transferPage.clickConfirmTransfer();

    // Submit invalid OTP
    await transferPage.otpModal.submitOtp('000000');

    // Assert error message in modal
    await expect(transferPage.otpModal.otpError).toBeVisible();
    await expect(transferPage.otpModal.otpError).toContainText(
      'Incorrect OTP. Please try again.'
    );

    // Verify transfer success banner does NOT appear
    await expect(transferPage.transferSuccessBanner).toBeHidden();
  });
});

