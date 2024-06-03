import { IBankAccount } from "@/models/IBankAccount";

export class BankAccountService {
  private static instance: BankAccountService;
  private static URL = "http://localhost:5200/BankAccount/user/personal";

  private constructor() {}
  static getInstance(): BankAccountService {
    if (!BankAccountService.instance) {
      BankAccountService.instance = new BankAccountService();
    }
    return BankAccountService.instance;
  }

  fetchBankAccounts(): Promise<IBankAccount[]> {
    return new Promise((resolve, reject) => {
      fetch(`${BankAccountService.URL}/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject("Error fetching bank accounts.");
        });
    });
  }
  deleteOneBankAccount(id: number, accountId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`${BankAccountService.URL}/bank/${id}?AccountId=${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error deleting bank account.");
          }
          resolve();
        })
        .catch((error) => {
          reject("Error deleting bank account.");
        });
    });
  }

  deleteAllBankAccounts(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`${BankAccountService.URL}/banks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error deleting bank accounts.");
          }
          resolve();
        })
        .catch((error) => {
          reject("Error deleting bank accounts.");
        });
    });
  }
}
