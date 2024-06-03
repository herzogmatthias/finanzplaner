import { InsuranceFormData } from "@/components/insuranceForm/insuranceForm.component";
import { IChart1Data, IChart2Data, IInsurance } from "@/models/IInsurance";
import { rejects } from "assert";

class InsuranceService {
  private static instance: InsuranceService;

  private static URL = "http://localhost:5200/Insurance/user/";

  static getInstance() {
    if (!this.instance) {
      this.instance = new InsuranceService();
    }
    return this.instance;
  }

  async fetchInsurances(): Promise<
    { description: string; insuranceId: number }[]
  > {
    // Mock fetching insurances
    return new Promise<{ description: string; insuranceId: number }[]>(
      async (resolve, reject) => {
        try {
          const response = await fetch(`${InsuranceService.URL}insurances`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          });
          const body = await response.json();
          if (response.ok) {
            resolve(body);
          } else {
            reject("Error fetching insurances.");
          }
        } catch (error) {
          reject("Error fetching insurances.");
        }
      }
    );
  }

  async fetchInsuranceDetails(id: number): Promise<IInsurance> {
    // Mock fetching insurance details
    return new Promise<IInsurance>((resolve) => {
      const response = fetch(`${InsuranceService.URL}insurance/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      response.then((res) => {
        res.json().then((body) => {
          console.log(body);
          resolve({
            ...body[0],
            additionalInformation: body[0].additionalInformation
              ? JSON.parse(body[0].additionalInformation)
              : [],
          });
        });
      });
    });
  }
  async fetchChart1Data(): Promise<IChart1Data> {
    // Mock fetching chart 1 data
    return new Promise<IChart1Data>((resolve, reject) => {
      const response = fetch(
        `${InsuranceService.URL}insurance/intervallChart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      response
        .then((res) => {
          res.json().then((body: IChart1Data) => {
            console.log(body);
            //sum up all values over the array for the three variables

            resolve(body);
          });
        })
        .catch((err) => {
          reject("Error fetching Intervall Chart data.");
        });
    });
  }

  async fetchChart2Data(): Promise<IChart2Data> {
    return new Promise<IChart2Data>((resolve, reject) => {
      const response = fetch(
        `${InsuranceService.URL}insurance/costHistoryChart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      response
        .then((res) => {
          res.json().then((body: IChart2Data) => {
            console.log(body);
            resolve(body);
          });
        })
        .catch((err) => {
          reject("Error fetching Cost History Chart data.");
        });
    });
  }
  deleteInsurance(insuranceId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(`${InsuranceService.URL}insurance/${insuranceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            resolve();
          } else {
            reject("Error deleting insurance.");
          }
        })
        .catch((err) => {
          reject("Error deleting insurance.");
        });
    });
  }
  updateInsurance(id: number, insurance: InsuranceFormData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(`${InsuranceService.URL}insurance/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          insuranceId: id,
          policyHolderId: insurance.accountId,
          insuranceType: insurance.type,
          paymentInstalmentAmount: insurance.paymentInstalmentAmount,
          paymentInstalmentUnitCurrency:
            insurance.paymentInstalmentUnitCurrency,
          country: insurance.country,
          paymentUnitCurrency: insurance.paymentUnitCurrency,
          dateClosed: null,
          frequency: insurance.paymentRate,
          paymentAmount: insurance.paymentAmount,
          dateOpened: new Date(insurance.startDate).toISOString(),
          insuranceState: insurance.isPaused,
          additionalInformation: JSON.stringify(
            insurance.additionalInformation
          ),
          polizze: insurance.policyNumber,
          insuranceCompany: insurance.insuranceCompany,
          description: insurance.insurance,
        }),
      })
        .then((res) => {
          if (res.ok) {
            resolve();
          } else {
            reject("Error updating insurance.");
          }
        })
        .catch((err) => {
          reject("Error updating insurance.");
        });
    });
  }
}

export default InsuranceService;
