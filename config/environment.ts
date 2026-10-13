export interface AppConfig {
  baseUrl: string;
  bankAppPath: string;
  defaultTimeout: number;
}

export const config: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.practiceqaautomation.com',
  bankAppPath: '/apps/bank',
  defaultTimeout: 10000,
};

