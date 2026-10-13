import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HistoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly downloadStatementButton: Locator;
  readonly accountSelect: Locator;
  readonly typeSelect: Locator;
  readonly rangeSelect: Locator;
  readonly searchInput: Locator;
  readonly transactionCount: Locator;
  readonly historyTable: Locator;
  readonly transactionRows: Locator;
  readonly pagePrevButton: Locator;
  readonly pageInfo: Locator;
  readonly pageNextButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByTestId('page-title');
    this.downloadStatementButton = page.getByTestId('download-statement');
    this.accountSelect = page.getByTestId('history-account');
    this.typeSelect = page.getByTestId('history-type');
    this.rangeSelect = page.getByTestId('history-range');
    this.searchInput = page.getByTestId('history-search');
    this.transactionCount = page.getByTestId('history-count');
    this.historyTable = page.getByTestId('history-table');
    this.transactionRows = page.getByTestId('history-row');
    this.pagePrevButton = page.getByTestId('page-prev');
    this.pageInfo = page.getByTestId('page-info');
    this.pageNextButton = page.getByTestId('page-next');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/apps/bank/history');
    await expect(this.historyTable).toBeVisible();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    // Give debounce a moment to update table filter
    await this.page.waitForTimeout(300);
  }

  async filterByAccount(accountOption: 'All accounts' | 'Savings' | 'Current'): Promise<void> {
    await this.accountSelect.selectOption({ label: accountOption });
    await this.page.waitForTimeout(300);
  }

  async filterByType(typeOption: 'Credits & debits' | 'Credits only' | 'Debits only'): Promise<void> {
    await this.typeSelect.selectOption({ label: typeOption });
    await this.page.waitForTimeout(300);
  }

  async filterByRange(rangeOption: 'Last 7 days' | 'Last 30 days' | 'Last 90 days'): Promise<void> {
    await this.rangeSelect.selectOption({ label: rangeOption });
    await this.page.waitForTimeout(300);
  }

  async getAllRowsText(): Promise<string[]> {
    return this.transactionRows.allInnerTexts();
  }

  async getLatestTransactionRow(): Promise<string> {
    await expect(this.transactionRows.first()).toBeVisible();
    return this.transactionRows.first().innerText();
  }

  async verifyTransactionPresent(referenceId: string): Promise<void> {
    const matchingRow = this.transactionRows.filter({ hasText: referenceId });
    await expect(matchingRow.first()).toBeVisible();
  }

  async verifyTransactionDetails(options: {
    referenceId: string;
    amount?: number | string;
    descriptionSnippet?: string;
  }): Promise<void> {
    const row = this.transactionRows.filter({ hasText: options.referenceId }).first();
    await expect(row).toBeVisible();

    if (options.amount) {
      await expect(row).toContainText(options.amount.toString());
    }

    if (options.descriptionSnippet) {
      await expect(row).toContainText(options.descriptionSnippet);
    }
  }

  async downloadCsv(): Promise<string | null> {
    try {
      const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 });
      await this.downloadStatementButton.click();
      const download = await downloadPromise;
      return download.suggestedFilename();
    } catch {
      return null;
    }
  }
}
