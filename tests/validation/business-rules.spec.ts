import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';

test.describe('TrustBank - Validation Suite - Business Rules & Form Validations', () => {
  test('TC_VAL_01: Mandatory field validation on Step 1 login form', async ({
    loginPage,
  }) => {
    await loginPage.goto();

    // Click Continue without filling customer ID or password
    await loginPage.submitStep1();

    // Verify error message for required customer ID
    await loginPage.expectErrorMessage('Customer ID must be 9 digits');
    await expect(loginPage.securityForm).toBeHidden();
  });

  test('TC_VAL_02: Mandatory field validation on Add Payee modal form', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();
    await transferPage.openAddPayeeModal();

    // Click Save payee without filling any fields
    await transferPage.addPayeeModal.save();

    // Assert validation error messages for required fields
    await expect(transferPage.addPayeeModal.nameError).toBeVisible();
    await expect(transferPage.addPayeeModal.nameError).toContainText(
      "Enter the payee's full name"
    );

    await expect(transferPage.addPayeeModal.accountError).toBeVisible();
    await expect(transferPage.addPayeeModal.accountError).toContainText(
      'Account number must be 9–18 digits'
    );

    await expect(transferPage.addPayeeModal.ifscError).toBeVisible();
    await expect(transferPage.addPayeeModal.ifscError).toContainText(
      'IFSC looks like ABCD0123456'
    );
  });

  test('TC_VAL_03: Mandatory field validation on Transfer Funds form', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    // Click Review transfer without selecting accounts or amount
    await transferPage.reviewTransferButton.click();

    // Assert validation error messages
    await expect(transferPage.errorFromAccount).toBeVisible();
    await expect(transferPage.errorFromAccount).toContainText('Choose an account');

    await expect(transferPage.errorPayee).toBeVisible();
    await expect(transferPage.errorPayee).toContainText('Choose a payee');

    await expect(transferPage.errorAmount).toBeVisible();
    await expect(transferPage.errorAmount).toContainText('Enter an amount');

    await expect(transferPage.errorMode).toBeVisible();
    await expect(transferPage.errorMode).toContainText('Choose a transfer mode');

    // Ensure review summary modal is NOT shown
    await expect(transferPage.reviewSummary).toBeHidden();
  });

  test('TC_VAL_04: Daily transfer limit boundary rule (amount exceeding ₹50,000)', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    await transferPage.fillTransferForm({
      fromAccountIndex: 1,
      payeeIndex: 1,
      amount: 60000.0, // Exceeds daily limit 50,000
      mode: 'IMPS',
    });

    await transferPage.submitReview();

    // Verify boundary validation error
    await expect(transferPage.errorAmount).toBeVisible();
    await expect(transferPage.errorAmount).toContainText(
      'Daily transfer limit is ₹50,000'
    );
    await expect(transferPage.reviewSummary).toBeHidden();
  });

  test('TC_VAL_05: Zero amount validation on Transfer Funds form', async ({
    authenticatedSession,
  }) => {
    const { transferPage } = authenticatedSession;

    await transferPage.goto();

    await transferPage.fillTransferForm({
      fromAccountIndex: 1,
      payeeIndex: 1,
      amount: 0, // Zero amount
      mode: 'IMPS',
    });

    await transferPage.submitReview();

    // Verify zero amount validation
    await expect(transferPage.errorAmount).toBeVisible();
    await expect(transferPage.errorAmount).toContainText('Enter an amount');
    await expect(transferPage.reviewSummary).toBeHidden();
  });

  test('TC_VAL_06: Role-Based Access Control validation for Branch Manager', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();

    // Login as Branch Manager
    await loginPage.login(
      BankTestData.credentials.validManager.managerId,
      BankTestData.credentials.validManager.password,
      BankTestData.credentials.validManager.securityAnswer
    );

    // Verify initial landing on approvals
    await expect(page).toHaveURL(/.*\/apps\/bank\/approvals/);

    // Attempt direct navigation to transfer funds
    await page.goto('/apps/bank/transfer');

    // Assert Access Denied security screen
    await expect(page.getByRole('heading', { name: /Access denied/i })).toBeVisible();
    await expect(
      page.locator("text=Branch managers review transfers — they can't make them").first()
    ).toBeVisible();
  });
});
