import { Locator, Page, expect } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly appLogo: Locator;
  readonly navDashboard: Locator;
  readonly navTransfer: Locator;
  readonly navHistory: Locator;
  readonly sessionTimer: Locator;
  readonly extendSessionButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.getByTestId('app-logo');
    this.navDashboard = page.getByTestId('nav-dashboard');
    this.navTransfer = page.getByTestId('nav-transfer');
    this.navHistory = page.getByTestId('nav-history');
    this.sessionTimer = page.getByTestId('session-timer');
    this.extendSessionButton = page.getByTestId('extend-session');
    this.logoutButton = page.getByTestId('bank-logout');
  }

  async goToDashboard(): Promise<void> {
    await this.navDashboard.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/dashboard/);
  }

  async goToTransfer(): Promise<void> {
    await this.navTransfer.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/transfer/);
  }

  async goToHistory(): Promise<void> {
    await this.navHistory.click();
    await expect(this.page).toHaveURL(/.*\/apps\/bank\/history/);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.page.getByTestId('bank-login-form')).toBeVisible();
  }

  async extendSession(): Promise<void> {
    await this.extendSessionButton.click();
  }

  async verifySessionActive(): Promise<void> {
    await expect(this.sessionTimer).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }
}

