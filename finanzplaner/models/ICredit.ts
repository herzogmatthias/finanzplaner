export interface ICredit {
  creditName: string;
  iban: string;
  creditorAccountId: string;
  loanName: string;
  loanAmount: number;
  interestRate: number;
  effectiveRate: number;
  term: number;
  additionalCosts: number;
  totalAmount: number;
  nextPaymentDate: Date;
  documents: string[];
  paymentRate: string;
  frequency: string;
  loanStatus: string;
  startDate: Date;
  endDate: Date;
  loanUnitCurrency: string;
}
