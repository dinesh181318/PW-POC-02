export const BankTestData = {
  credentials: {
    validCustomer: {
      customerId: '100200300',
      password: 'Bank@123',
      securityAnswer: 'greenwood',
      otp: '246810',
    },
    validManager: {
      managerId: '900800700',
      password: 'Bank@123',
      securityAnswer: 'greenwood',
      otp: '246810',
    },
    invalidCustomer: {
      customerId: '999999999',
      password: 'WrongPassword!1',
      securityAnswer: 'incorrect',
      otp: '000000',
    },
    lockedOutCustomer: {
      customerId: '100200300',
      wrongPassword: 'InvalidPassword123',
    },
  },
  beneficiaries: {
    standard: {
      name: 'Alice Johnson',
      accountNumber: '9876543210',
      routingOrIfsc: 'TRUST001234',
      accountType: 'Savings',
      nickname: 'Alice Savings',
    },
    quickTransfer: {
      name: 'Robert Smith',
      accountNumber: '1122334455',
      routingOrIfsc: 'TRUST009876',
      accountType: 'Checking',
      nickname: 'Bob Rent',
    },
  },
  transfers: {
    validTransfer: {
      amount: 150.0,
      description: 'Monthly utility bill payment',
      otp: '246810',
    },
    lowAmountTransfer: {
      amount: 25.5,
      description: 'Dinner split',
      otp: '246810',
    },
    exceedsBalanceTransfer: {
      amount: 999999999.0,
      description: 'Overdraft test',
      otp: '246810',
    },
    invalidAmountTransfer: {
      amount: -50,
      description: 'Negative amount test',
    },
  },
};

