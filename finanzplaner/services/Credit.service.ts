// src/services/Credit.service.ts

import { FormValues } from "@/components/creditform/creditForm.component";
import { ICredit } from "@/models/ICredit";
import { ICreditMasterData } from "@/models/ICreditMasterData";
import { start } from "repl";

class CreditService {
  private static instance: CreditService;

  private static URL = "http://localhost:5200/Credit/user/";
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
      fetch(CreditService.URL + "allcredits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject("Error fetching credits.");
        });
    });
  }

  fetchCreditDetails(id: number): Promise<ICredit> {
    return new Promise((resolve, reject) => {
      fetch(CreditService.URL + "credit/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data[0]);
        })
        .catch((error) => {
          reject("Error fetching credit details.");
        });
    });
  }
  deleteCredit(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(CreditService.URL + "credit/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) =>
          resolve(
            response.ok ? "Kredit gelöscht" : "Fehler beim löschen des Kredits"
          )
        )
        .catch((error) => {
          reject("Fehler beim löschen des Kredits");
        });
    });
  }

  updateCredit(id: number, data: FormValues) {
    return new Promise((resolve, reject) => {
      fetch(CreditService.URL + "credit/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          loanId: id,
          creditorAccountId: data.accountID,
          loanAmount: data.creditAmount,
          interestRate: data.interest,
          effectiveInterestRate: 0,
          startDate: data.startDate,
          endDate: data.endDate,
          loanName: data.name,
          additionalCosts: data.extraCosts,
          frequency: data.frequency,
          loanStatus: data.loanStatus,
          loanUnitCurrency: "USD",
          interestRateUnitCurrency: "USD",
          loanTerm: 0,
        }),
      })
        .then((response) =>
          response.ok
            ? resolve("Credit updated.")
            : reject("Error updating credit.")
        )
        .catch((error) => {
          reject("Error updating credit.");
        });
    });
  }

  addCredit(data: FormValues) {
    return new Promise((resolve, reject) => {
      fetch(CreditService.URL + "credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          creditorAccountId: data.accountID,
          loanAmount: data.creditAmount,
          interestRate: data.interest,
          effectiveInterestRate: 0,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          loanType: "Credit",
          loanName: data.name,
          additionalCosts: data.extraCosts,
          frequency: data.frequency,
          loanStatus: "Active",
          loanUnitCurrency: localStorage.getItem("currency") || "EUR",
          interestRateUnitCurrency: "EUR",
          loanTerm: 0,
        }),
      })
        .then((response) => {
          response.ok
            ? resolve("Credit added.")
            : reject("Error adding credit.");
        })
        .catch((error) => {
          reject("Error adding credit.");
        });
    });
  }
}

export default CreditService;
