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
  accountName: string;
  data: { date: string; value: number }[];
}

class AccountService {
  private static instance: AccountService;
  private static URL = "http://localhost:5200/Transaction/user/transactions";
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
      fetch(AccountService.URL + "/expenserevenuechart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          account: filters.account.map((a) => a.value),
          dateFrom: filters.dateFrom
            ? filters.dateFrom
            : new Date(1900, 0, 1).toISOString(),
          dateTo: filters.dateTo
            ? filters.dateTo
            : new Date(9998, 11, 31).toISOString(),
          freeText: filters.freeText,
          iban: filters.iban,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error fetching transactions.");
          return response.json();
        })
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject("Fehler beim Laden der Transaktionen.");
        });
    });
  }

  public async fetchAccountData(
    filters: IFilters
  ): Promise<{ accounts: { [key: string]: AccountData } }> {
    return new Promise((resolve, reject) => {
      fetch(AccountService.URL + "/assetChart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          account: filters.account.map((a) => a.value),
          dateFrom: filters.dateFrom
            ? filters.dateFrom
            : new Date(1900, 0, 1).toISOString(),
          dateTo: filters.dateTo
            ? filters.dateTo
            : new Date(9998, 11, 31).toISOString(),
          freeText: filters.freeText,
          iban: filters.iban,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error fetching transactions.");
          return response.json();
        })
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject("Fehler beim Laden der Transaktionen.");
        });
    });
  }
  async fetchTransactionData(filters: IFilters): Promise<ITransaction[]> {
    console.log("Hello");

    return new Promise((resolve, reject) => {
      fetch(AccountService.URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          accounts: filters.account.map((a) => a.value),
          dateFrom: filters.dateFrom
            ? filters.dateFrom
            : new Date(1900, 0, 1).toISOString(),
          dateTo: filters.dateTo
            ? filters.dateTo
            : new Date(9998, 11, 31).toISOString(),
          freeText: filters.freeText,
          iban: filters.iban,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error fetching transactions.");
          return response.json();
        })
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          reject("Fehler beim Laden der Transaktionen.");
        });
    });
  }
}

export default AccountService;
