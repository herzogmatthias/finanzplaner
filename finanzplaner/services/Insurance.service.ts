import { IChart1Data, IChart2Data, IInsurance } from "@/models/IInsurance";

class InsuranceService {
  private static instance: InsuranceService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new InsuranceService();
    }
    return this.instance;
  }

  async fetchInsurances(): Promise<{ insuranceName: string; id: number }[]> {
    // Mock fetching insurances
    return new Promise<{ insuranceName: string; id: number }[]>((resolve) =>
      setTimeout(
        () =>
          resolve([
            { insuranceName: "Versicherung #1", id: 1 },
            { insuranceName: "Versicherung #2", id: 2 },
            { insuranceName: "Versicherung #3", id: 3 },
          ]),
        1000
      )
    );
  }

  async fetchInsuranceDetails(id: number): Promise<IInsurance> {
    // Mock fetching insurance details
    return new Promise<IInsurance>((resolve) =>
      setTimeout(
        () =>
          resolve({
            id,
            iban: "DE12345678901234567890",
            insuranceCompany: `Versicherungsgesellschaft #${id}`,
            name: `Versicherung #${id}`,
            paymentrate: "monatlich",
            payment: 123.0,
            startdate: "2019-08-24",
            isPaused: false,
            additionalInformation: [
              { description: "replaced value in case of theft", value: "500€" },
              { description: "monthly service fee", value: "10€" },
            ],
            nextPayment: "2022-08-24",
            files: ["Dokument 1", "Dokument 2"],
          }),
        1000
      )
    );
  }
  async fetchChart1Data(): Promise<IChart1Data> {
    // Mock fetching chart 1 data
    return new Promise<IChart1Data>((resolve) =>
      setTimeout(
        () =>
          resolve({
            monthlyPayment: 500,
            quarterPayment: 1500,
            yearlyPayment: 6000,
            costsNextMonth: 1234.0,
          }),
        1000
      )
    );
  }

  async fetchChart2Data(): Promise<IChart2Data> {
    // Mock fetching chart 2 data for the whole year
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const insurances = [
      "Versicherung #1",
      "Versicherung #2",
      "Versicherung #3",
    ];

    const insuranceCosts = months.flatMap((month) =>
      insurances.map((insurance) => ({
        month,
        insurance,
        cost: Math.random() * 500 + 50, // random cost between 50 and 550
      }))
    );

    return new Promise<IChart2Data>((resolve) =>
      setTimeout(
        () =>
          resolve({
            insuranceCosts,
          }),
        1000
      )
    );
  }
}

export default InsuranceService;
