/**
 * Utility functions for currency string parsing and number formatting
 */
export class CurrencyUtils {
  /**
   * Parse Indian Rupee formatted string (e.g. "₹1,25,430.50" or "+₹85,000.00" or "−₹500.00") into numeric float
   */
  static parseRupee(value: string): number {
    if (!value) return 0;
    // Replace unicode minus − or hyphen -
    const isNegative = value.includes('−') || value.includes('-');
    const cleaned = value.replace(/[₹,+\-−\s]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    return isNegative ? -num : num;
  }

  /**
   * Format number as currency string for assertions
   */
  static formatAmount(amount: number): string {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

