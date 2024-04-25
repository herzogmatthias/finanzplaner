// interface
export interface ICreditDetails {
  loanAmount: number;
  annualRate: number;
  effectiveRate: number;
  otherFeesPA: number;
  term: number;
  totalAmount: number;
  nextPaymentDate: Date;
  startDate: Date;
}
