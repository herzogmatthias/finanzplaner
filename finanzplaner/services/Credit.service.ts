// src/services/Credit.service.ts

import { ICredit } from "@/models/ICredit";
import { ICreditMasterData } from "@/models/ICreditMasterData";

class CreditService {
  private static instance: CreditService;
  private credits = [
    { creditName: "Credit 1", id: 1 },
    { creditName: "Credit 2", id: 2 },
    { creditName: "Credit 3", id: 3 },
  ];

  private constructor() {}

  static getInstance(): CreditService {
    if (!CreditService.instance) {
      CreditService.instance = new CreditService();
    }
    return CreditService.instance;
  }

  fetchCredits(): Promise<ICreditMasterData[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //reject("Error fetching credits.");
        resolve(this.credits);
      }, 2000);
    });
  }

  fetchCreditDetails(id: number): Promise<ICredit> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const credit = {
          creditName: "Credit 1",
          iban: "DE123456789",
          loanAmount: 100000,
          annualRate: 8,
          effectiveRate: 8.3,
          term: 40,
          otherFeesPA: 1000,
          totalAmount: 123000,
          nextPaymentDate: new Date(),
          documents: ["Document 1", "Document 2"],
          paymentRate: "monthly",
          startDate: new Date("2021-01-01"),
        };
        if (id) {
          resolve(credit);
        } else {
          reject("Credit not found");
        }
      }, 2000);
    });
  }
}

export default CreditService;
