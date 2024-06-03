export interface IStandingOrder {
  orderId: number;
  creditorAccountId: string;
  frequency: string;
  numberOfPayments: number;
  firstPaymentDateTime: string; // ISO 8601 format
  finalPaymentDateTime: string; // ISO 8601 format
  reference: string;
  paymentAmount: number;
  paymentCurrency: string;
  issuer: string;
  nextPayment: string; // ISO 8601 format
}
