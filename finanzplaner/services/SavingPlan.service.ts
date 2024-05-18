import { ISavingPlan } from "@/models/ISavingPlan";

// savingplans.service.ts
export class SavingPlanService {
  private static instance: SavingPlanService;
  private plans: ISavingPlan[];

  private constructor() {
    this.plans = [
      {
        id: 1,
        paymentrate: "Monthly",
        nextPayment: "2024-05-01",
        to: "Car Loan",
        value: 200,
        from: "Bank A",
        accountName: "Savings Account",
        until: "2027-05-01",
        name: "Car Payment",
      },
      {
        id: 2,
        paymentrate: "Yearly",
        nextPayment: "2024-12-24",
        to: "Home Loan",
        value: 1200,
        from: "Bank B",
        accountName: "Main Account",
        until: "2040-12-24",
        name: "Mortgage",
      },
      {
        id: 3,
        paymentrate: "Quarterly",
        nextPayment: "2024-08-24",
        to: "Education",
        value: 450,
        from: "Bank A",
        accountName: "Savings Account",
        until: "2029-08-24",
        name: "School Fees",
      },
    ];
  }

  static getInstance(): SavingPlanService {
    if (!SavingPlanService.instance) {
      SavingPlanService.instance = new SavingPlanService();
    }
    return SavingPlanService.instance;
  }

  fetchPlans(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.plans);
      }, 2000);
    });
  }
}
