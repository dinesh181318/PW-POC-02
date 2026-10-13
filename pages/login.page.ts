import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly loginForm: Locator;
  readonly customerIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;

  // Step 2 elements
  readonly securityForm: Locator;
  readonly securityQuestion: Locator;
  readonly securityAnswerInput: Locator;
  readonly verifyAnswerButton: Locator;
  readonly backToStep1Button: Locator;

  // Feedback & Lockout elements
  readonly loginError: Locator;
  readonly unlockButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginForm = page.getByTestId('bank-login-form');
    this.customerIdInput = page.getByTestId('customer-id');
    this.passwordInput = page.getByTestId('bank-password');
    this.loginSubmitButton = page.getByTestId('login-submit');

    this.securityForm = page.getByTestId('security-form');
    this.securityQuestion = page.getByTestId('security-question');
    this.securityAnswerInput = page.getByTestId('security-answer');
    this.verifyAnswerButton = page.getByTestId('verify-answer');
    this.backToStep1Button = page.getByTestId('back-to-step-1');

    this.loginError = page.getByTestId('login-error');
    this.unlockButton = page.getByRole('button', { name: /Unlock \(practice reset\)/i });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/apps/bank');
    // If account was locked previously during exploratory session, reset it
    await this.unlockIfLocked();
    await expect(this.loginForm).toBeVisible();
  }

  async fillStep1(customerId: string, password: string): Promise<void> {
    await this.customerIdInput.fill(customerId);
    await this.passwordInput.fill(password);
  }

  async submitStep1(): Promise<void> {
    await this.loginSubmitButton.click();
  }

  async fillStep2(securityAnswer: string): Promise<void> {
    await expect(this.securityForm).toBeVisible();
    await this.securityAnswerInput.fill(securityAnswer);
  }

  async submitStep2(): Promise<void> {
    await this.verifyAnswerButton.click();
  }

  async login(
    customerId: string,
    password: string,
    securityAnswer: string
  ): Promise<void> {
    await this.fillStep1(customerId, password);
    await this.submitStep1();
    await this.fillStep2(securityAnswer);
    await this.submitStep2();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/dashboard/);
  }

  async unlockIfLocked(): Promise<void> {
    if (await this.unlockButton.isVisible()) {
      await this.unlockButton.click();
      await expect(this.loginForm).toBeVisible();
    }
  }

  async expectErrorMessage(messageSnippet: string): Promise<void> {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText(messageSnippet);
  }

  async expectLockoutState(): Promise<void> {
    await expect(this.loginError).toContainText('Your login is locked after 3 failed attempts');
    await expect(this.customerIdInput).toBeDisabled();
    await expect(this.unlockButton).toBeVisible();
  }
}

