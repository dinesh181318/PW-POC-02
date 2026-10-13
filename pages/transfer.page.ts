import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { AddPayeeModalComponent } from '../components/add-payee-modal.component';
import { OtpModalComponent } from '../components/otp-modal.component';
import { CurrencyUtils } from '../utils/currency-utils';

export type TransferMode = 'IMPS' | 'NEFT' | 'RTGS';

export interface TransferRequest {
  fromAccountIndex?: number;
  payeeName?: string;
  payeeIndex?: number;
  amount: number | string;
  remarks?: string;
  mode?: TransferMode;
}

export interface ReceiptDetails {
  referenceId: string;
  amount: string;
  details: string;
  newBalance: string;
}

export class TransferPage extends BasePage {
  readonly addPayeeModal: AddPayeeModalComponent;
  readonly otpModal: OtpModalComponent;

  // Transfer form
  readonly transferForm: Locator;
  readonly fromAccountSelect: Locator;
  readonly payeeSelect: Locator;
  readonly addPayeeButton: Locator;
  readonly amountInput: Locator;
  readonly remarksInput: Locator;
  readonly modeImpsButton: Locator;
  readonly modeNeftButton: Locator;
  readonly modeRtgsButton: Locator;
  readonly reviewTransferButton: Locator;

  // Review step
  readonly reviewSummary: Locator;
  readonly reviewFrom: Locator;
  readonly reviewPayee: Locator;
  readonly reviewMode: Locator;
  readonly reviewAmount: Locator;
  readonly editTransferButton: Locator;
  readonly confirmTransferButton: Locator;

  // Processing & Receipt step
  readonly processingIndicator: Locator;
  readonly transferSuccessBanner: Locator;
  readonly receiptAmount: Locator;
  readonly transactionReference: Locator;
  readonly receiptDetails: Locator;
  readonly newBalance: Locator;
  readonly downloadReceiptButton: Locator;
  readonly newTransferLink: Locator;
  readonly backToDashboardLink: Locator;

  constructor(page: Page) {
    super(page);
    this.addPayeeModal = new AddPayeeModalComponent(page);
    this.otpModal = new OtpModalComponent(page);

    this.transferForm = page.getByTestId('transfer-form');
    this.fromAccountSelect = page.getByTestId('from-account');
    this.payeeSelect = page.getByTestId('payee');
    this.addPayeeButton = page.getByTestId('add-payee');
    this.amountInput = page.getByTestId('amount');
    this.remarksInput = page.getByTestId('remarks');
    this.modeImpsButton = page.getByTestId('mode-imps');
    this.modeNeftButton = page.getByTestId('mode-neft');
    this.modeRtgsButton = page.getByTestId('mode-rtgs');
    this.reviewTransferButton = page.getByTestId('review-transfer');

    this.reviewSummary = page.getByTestId('review-summary');
    this.reviewFrom = page.getByTestId('review-from');
    this.reviewPayee = page.getByTestId('review-payee');
    this.reviewMode = page.getByTestId('review-mode');
    this.reviewAmount = page.getByTestId('review-amount');
    this.editTransferButton = page.getByTestId('edit-transfer');
    this.confirmTransferButton = page.getByTestId('confirm-transfer');

    this.processingIndicator = page.getByTestId('processing');
    this.transferSuccessBanner = page.getByTestId('transfer-success');
    this.receiptAmount = page.getByTestId('transfer-amount');
    this.transactionReference = page.getByTestId('transaction-ref');
    this.receiptDetails = page.getByTestId('transfer-details');
    this.newBalance = page.getByTestId('new-balance');
    this.downloadReceiptButton = page.getByTestId('download-receipt');
    this.newTransferLink = page.getByTestId('new-transfer');
    this.backToDashboardLink = page.getByTestId('back-to-dashboard');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/apps/bank/transfer');
    await expect(this.transferForm).toBeVisible();
  }

  async openAddPayeeModal(): Promise<void> {
    await this.addPayeeButton.click();
    await expect(this.addPayeeModal.modal).toBeVisible();
  }

  async selectMode(mode: TransferMode): Promise<void> {
    if (mode === 'IMPS') {
      await this.modeImpsButton.click();
    } else if (mode === 'NEFT') {
      await this.modeNeftButton.click();
    } else if (mode === 'RTGS') {
      await this.modeRtgsButton.click();
    }
  }

  async fillTransferForm(request: TransferRequest): Promise<void> {
    await this.fromAccountSelect.selectOption({ index: request.fromAccountIndex ?? 1 });

    if (request.payeeName) {
      const option = this.payeeSelect.locator('option', { hasText: request.payeeName }).first();
      const value = await option.getAttribute('value');
      if (value) {
        await this.payeeSelect.selectOption(value);
      } else {
        await this.payeeSelect.selectOption({ index: 1 });
      }
    } else {
      await this.payeeSelect.selectOption({ index: request.payeeIndex ?? 1 });
    }

    await this.amountInput.fill(request.amount.toString());

    if (request.remarks) {
      await this.remarksInput.fill(request.remarks);
    }

    if (request.mode) {
      await this.selectMode(request.mode);
    }
  }

  async clickReviewTransfer(): Promise<void> {
    await this.reviewTransferButton.click();
    await expect(this.reviewSummary).toBeVisible();
  }

  async verifyReviewDetails(expected: {
    mode?: string;
    amount?: string | number;
    payeeSnippet?: string;
  }): Promise<void> {
    await expect(this.reviewSummary).toBeVisible();
    if (expected.mode) {
      await expect(this.reviewMode).toContainText(expected.mode);
    }
    if (expected.amount) {
      const formatted = typeof expected.amount === 'number'
        ? CurrencyUtils.formatAmount(expected.amount)
        : expected.amount;
      await expect(this.reviewAmount).toContainText(formatted);
    }
    if (expected.payeeSnippet) {
      await expect(this.reviewPayee).toContainText(expected.payeeSnippet);
    }
  }

  async clickConfirmTransfer(): Promise<void> {
    await this.confirmTransferButton.click();
    await expect(this.otpModal.modal).toBeVisible();
  }

  async submitOtpAndCompleteTransfer(otp: string): Promise<ReceiptDetails> {
    await this.otpModal.submitOtp(otp);

    // Wait for processing indicator to appear and resolve, or wait for success banner
    await expect(this.transferSuccessBanner).toBeVisible({ timeout: 15000 });

    const ref = await this.transactionReference.innerText();
    const amount = await this.receiptAmount.innerText();
    const details = await this.receiptDetails.innerText();
    const balance = await this.newBalance.innerText();

    return {
      referenceId: ref.trim(),
      amount: amount.trim(),
      details: details.trim(),
      newBalance: balance.trim(),
    };
  }

  async completeEndToEndTransfer(
    request: TransferRequest,
    otp: string
  ): Promise<ReceiptDetails> {
    await this.fillTransferForm(request);
    await this.clickReviewTransfer();
    await this.clickConfirmTransfer();
    return await this.submitOtpAndCompleteTransfer(otp);
  }

  async goToDashboardFromReceipt(): Promise<void> {
    await this.backToDashboardLink.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/dashboard/);
  }
}
