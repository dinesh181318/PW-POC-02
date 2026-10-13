import { Locator, Page, expect } from '@playwright/test';

export interface PayeeDetails {
  name: string;
  accountNumber: string;
  confirmAccountNumber?: string;
  ifsc: string;
}

export class AddPayeeModalComponent {
  readonly page: Page;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly payeeNameInput: Locator;
  readonly payeeAccountInput: Locator;
  readonly payeeConfirmAccountInput: Locator;
  readonly payeeIfscInput: Locator;
  readonly savePayeeButton: Locator;
  readonly ifscError: Locator;
  readonly confirmAccountError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByTestId('add-payee-modal');
    this.closeButton = page.getByTestId('add-payee-modal-close');
    this.payeeNameInput = page.getByTestId('payee-name');
    this.payeeAccountInput = page.getByTestId('payee-account');
    this.payeeConfirmAccountInput = page.getByTestId('payee-confirm-account');
    this.payeeIfscInput = page.getByTestId('payee-ifsc');
    this.savePayeeButton = page.getByTestId('save-payee');
    this.ifscError = page.getByTestId('error-payee-ifsc');
    this.confirmAccountError = page.getByTestId('error-payee-confirm-account');
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async fillPayeeDetails(details: PayeeDetails): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.payeeNameInput.fill(details.name);
    await this.payeeAccountInput.fill(details.accountNumber);
    await this.payeeConfirmAccountInput.fill(details.confirmAccountNumber ?? details.accountNumber);
    await this.payeeIfscInput.fill(details.ifsc);
  }

  async save(): Promise<void> {
    await this.savePayeeButton.click();
  }

  async saveSuccessfully(): Promise<void> {
    await this.save();
    await expect(this.modal).toBeHidden();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.modal).toBeHidden();
  }

  async verifyIfscError(expectedMessage = 'IFSC looks like ABCD0123456'): Promise<void> {
    await expect(this.ifscError).toBeVisible();
    await expect(this.ifscError).toContainText(expectedMessage);
  }
}
