/**
 * Utility functions for generating dynamic test data
 */
export class DataGenerator {
  /**
   * Generates a unique beneficiary name
   */
  static generateBeneficiaryName(prefix = 'TestPayee'): string {
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix} ${timestamp}`;
  }

  /**
   * Generates a 10-digit account number
   */
  static generateAccountNumber(): string {
    return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  /**
   * Generates a valid 11-character Indian Financial System Code (IFSC)
   * Pattern: 4 letters + '0' + 6 numbers
   */
  static generateValidIfsc(bankCode = 'TBIC'): string {
    const branchCode = Math.floor(100000 + Math.random() * 900000).toString();
    return `${bankCode}0${branchCode}`;
  }

  /**
   * Generates a unique transaction remark
   */
  static generateRemarks(prefix = 'Payment'): string {
    return `${prefix} ref-${Date.now().toString().slice(-6)}`;
  }
}

