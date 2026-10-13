import { Locator, Page, expect } from '@playwright/test';

export class OtpModalComponent {
  readonly page: Page;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly otpInput: Locator;
  readonly verifyButton: Locator;
  readonly errorMessage: Locator;
  readonly otpError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByTestId('otp-modal');
    this.closeButton = page.getByTestId('otp-modal-close');
    this.otpInput = page.getByTestId('otp-input');
    this.verifyButton = page.getByTestId('verify-otp');
    this.otpError = page.getByTestId('otp-error');
    this.errorMessage = page.locator('[data-testid="otp-modal"] [data-testid*="error"], [data-testid="otp-modal"] .text-red-600, [data-testid="otp-modal"] .text-red-400');
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async enterOtp(otp: string): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.otpInput.fill(otp);
  }

  async submitOtp(otp: string): Promise<void> {
    await this.enterOtp(otp);
    await this.verifyButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.modal).toBeHidden();
  }

  async verifyErrorDisplayed(expectedText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }
}
