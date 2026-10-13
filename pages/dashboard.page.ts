import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { AddPayeeModalComponent } from '../components/add-payee-modal.component';

export class DashboardPage extends BasePage {
  readonly actionTransfer: Locator;
  readonly actionAddPayee: Locator;
  readonly actionStatements: Locator;
  readonly recentTransactionsTable: Locator;
  readonly transactionRows: Locator;
  readonly addPayeeModal: AddPayeeModalComponent;

  constructor(page: Page) {
    super(page);
    this.actionTransfer = page.getByTestId('action-transfer');
    this.actionAddPayee = page.getByTestId('action-add-payee');
    this.actionStatements = page.getByTestId('action-history');
    this.recentTransactionsTable = page.getByTestId('recent-transactions');
    this.transactionRows = page.getByTestId('txn-row');
    this.addPayeeModal = new AddPayeeModalComponent(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/apps/bank/dashboard');
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/dashboard/);
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/dashboard/);
    await expect(this.header.sessionTimer).toBeVisible();
    await expect(this.recentTransactionsTable).toBeVisible();
  }

  async clickTransferAction(): Promise<void> {
    await this.actionTransfer.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/transfer/);
  }

  async clickStatementsAction(): Promise<void> {
    await this.actionStatements.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/history/);
  }

  async clickAddPayeeAction(): Promise<void> {
    await this.actionAddPayee.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/transfer\?addPayee=1/);
  }

  async getRecentTransactionCount(): Promise<number> {
    return this.transactionRows.count();
  }

  async getRecentTransactionRowsText(): Promise<string[]> {
    return this.transactionRows.allInnerTexts();
  }

  async verifyRecentTransactionExists(snippet: string): Promise<void> {
    await expect(this.transactionRows.filter({ hasText: snippet }).first()).toBeVisible();
  }
}

