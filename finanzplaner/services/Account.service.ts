// services/AccountService.ts
import { IFilters } from "@/context/filter.context";
import { transactions } from "@/data/transactions.data";
import { ITransaction } from "@/models/ITransaction";
import { MdAccountBalanceWallet, MdAccountBalance } from "react-icons/md";

export interface Account {
  id: number;
  name: string;
  balance: string;
  bank: string;
  icon: React.ElementType;
}

export interface RevenueExpenditure {
  date: string;
  expense: number;
  revenue: number;
}

export interface AccountData {
  name: string;
  data: { date: string; value: number }[];
}

class AccountService {
  private static instance: AccountService;
  private accounts: Account[];

  private constructor() {
    this.accounts = [
      {
        id: 1,
        name: "Girokonto",
        balance: "768.39€",
        bank: "Bank #1",
        icon: MdAccountBalanceWallet,
      },
      {
        id: 2,
        name: "Sparen",
        balance: "768.39€",
        bank: "Bank #2",
        icon: MdAccountBalance,
      },
    ];
  }

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  public async fetchAccounts(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.accounts);
        // If you want to simulate an error, uncomment the next line
        // reject(new Error("Failed to fetch accounts."));
      }, 2000); // Simulate a network delay
    });
  }

  public async fetchRevenueExpenditure(
    filters: IFilters
  ): Promise<RevenueExpenditure[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: RevenueExpenditure[] = [
          { date: "2019-08-24", expense: 200, revenue: 300 },
          { date: "2019-09-24", expense: 250, revenue: 350 },
          { date: "2019-10-24", expense: 300, revenue: 400 },
          { date: "2019-11-24", expense: 200, revenue: 450 },
          { date: "2019-12-24", expense: 150, revenue: 500 },
        ];
        resolve(data);
        // If you want to simulate an error, uncomment the next line
        // reject(new Error("Failed to fetch revenue and expenditure data."));
      }, 2000); // Simulate a network delay
    });
  }

  public async fetchAccountData(filters: IFilters): Promise<AccountData[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: AccountData[] = [
          {
            name: "Account #1",
            data: [
              { date: "12.01.2023", value: 20000 },
              { date: "12.02.2023", value: 21000 },
              { date: "12.03.2023", value: 22000 },
              { date: "12.04.2023", value: 23000 },
              { date: "12.05.2023", value: 24000 },
              { date: "12.06.2023", value: 25000 },
            ],
          },
          {
            name: "Account #2",
            data: [
              { date: "12.01.2023", value: 30000 },
              { date: "12.02.2023", value: 30500 },
              { date: "12.03.2023", value: 31000 },
              { date: "12.04.2023", value: 31500 },
              { date: "12.05.2023", value: 32000 },
              { date: "12.06.2023", value: 32500 },
            ],
          },
        ];
        resolve(data);
        // If you want to simulate an error, uncomment the next line
        // reject(new Error("Failed to fetch account data."));
      }, 2000); // Simulate a network delay
    });
  }
  async fetchTransactionData(filters: IFilters): Promise<ITransaction[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(transactions);
        // If you want to simulate an error, uncomment the next line
        // reject(new Error("Failed to fetch account data."));
      }, 2000); // Simulate a network delay
    });
  }
}

export default AccountService;
