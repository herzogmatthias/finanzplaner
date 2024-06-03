// interfaces/TransactionData.ts
export interface ITransaction {
  transactionId: string;
  accountId: string;
  amount: number;
  bookingDateTime: string;
  transactionInformation: string;
  amountCurrency: string;
  transactionIssuer: string;
  supplementaryData: string;
  merchantName: string;
}
