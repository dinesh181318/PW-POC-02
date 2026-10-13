import { test, expect } from '../../fixtures/bank-fixtures';
import { BankTestData } from '../../test-data/bank-data';

test.describe('TrustBank - Negative Suite - Authentication & Lockout', () => {
  test('TC_NEG_01: Verify attempt counter countdown on incorrect password', async ({
    loginPage,
  }) => {
    await loginPage.goto();

    // 1st failed attempt
    await loginPage.fillStep1(
      BankTestData.credentials.validCustomer.customerId,
      'WrongPassword1'
    );
    await loginPage.submitStep1();
    await loginPage.expectErrorMessage('2 attempts left');

    // 2nd failed attempt
    await loginPage.fillStep1(
      BankTestData.credentials.validCustomer.customerId,
      'WrongPassword2'
    );
    await loginPage.submitStep1();
    await loginPage.expectErrorMessage('1 attempt left');
  });

  test('TC_NEG_02: Verify 3-attempt account lockout, disabled input, and unlock reset', async ({
    loginPage,
  }) => {
    await loginPage.goto();

    // Perform 3 invalid attempts
    for (let attempt = 1; attempt <= 3; attempt++) {
      await loginPage.fillStep1(
        BankTestData.credentials.validCustomer.customerId,
        `IncorrectPassword${attempt}`
      );
      await loginPage.submitStep1();
    }

    // Verify account lockout state
    await loginPage.expectLockoutState();

    // Unlock account via practice reset
    await loginPage.unlockIfLocked();
    await expect(loginPage.customerIdInput).toBeEnabled();

    // Verify successful login is now possible after unlock
    await loginPage.login(
      BankTestData.credentials.validCustomer.customerId,
      BankTestData.credentials.validCustomer.password,
      BankTestData.credentials.validCustomer.securityAnswer
    );
  });

  test('TC_NEG_03: Verify rejection of invalid security answer in Step 2', async ({
    loginPage,
  }) => {
    await loginPage.goto();

    // Pass Step 1
    await loginPage.fillStep1(
      BankTestData.credentials.validCustomer.customerId,
      BankTestData.credentials.validCustomer.password
    );
    await loginPage.submitStep1();

    // Provide invalid security answer in Step 2
    await loginPage.fillStep2('IncorrectSchoolName');
    await loginPage.submitStep2();

    // Assert specific step 2 error message
    await loginPage.expectErrorMessage("That answer doesn't match our records");
  });
});

