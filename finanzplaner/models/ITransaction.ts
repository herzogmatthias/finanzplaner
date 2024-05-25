// interfaces/TransactionData.ts
export interface ITransaction {
  transactionID: string;
  accountID: string;
  amount: number;
  bookingDateTime: string;
  transactionInformation: string;
  amountCurrency: string;
  transactionIssuer: string;
  supplementaryData: string;
  merchantName: string;
}
