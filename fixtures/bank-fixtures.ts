import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { TransferPage } from '../pages/transfer.page';
import { HistoryPage } from '../pages/history.page';
import { BankTestData } from '../test-data/bank-data';

export interface BankFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  transferPage: TransferPage;
  historyPage: HistoryPage;
  authenticatedSession: {
    dashboardPage: DashboardPage;
    transferPage: TransferPage;
    historyPage: HistoryPage;
  };
}

export const test = baseTest.extend<BankFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  transferPage: async ({ page }, use) => {
    const transferPage = new TransferPage(page);
    await use(transferPage);
  },

  historyPage: async ({ page }, use) => {
    const historyPage = new HistoryPage(page);
    await use(historyPage);
  },

  authenticatedSession: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      BankTestData.credentials.validCustomer.customerId,
      BankTestData.credentials.validCustomer.password,
      BankTestData.credentials.validCustomer.securityAnswer
    );

    const dashboardPage = new DashboardPage(page);
    const transferPage = new TransferPage(page);
    const historyPage = new HistoryPage(page);

    await use({ dashboardPage, transferPage, historyPage });
  },
});

export { expect };

