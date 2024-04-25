export interface ICredit {
  creditName: string;
  iban: string;
  loanAmount: number;
  annualRate: number;
  effectiveRate: number;
  term: number;
  otherFeesPA: number;
  totalAmount: number;
  nextPaymentDate: Date;
  documents: string[];
  paymentRate: string;
  startDate: Date;
}
