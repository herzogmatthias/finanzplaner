export interface IAdditionalInformation {
  description: string;
  value: string;
}

export interface IInsurance {
  insuranceId: number;
  policyHolderId: string;
  insuranceCompany: string;
  insuranceType: string;
  name: string;
  description: string;
  paymentInstalmentAmount: number;
  paymentInstalmentUnitCurrency: string;
  country: string;
  paymentUnitCurrency: string;
  dateClosed: string;
  frequency: string;
  paymentAmount: number;
  dateOpened: string;
  insuranceState: boolean;
  polizze: string;
  additionalInformation: IAdditionalInformation[];
  nextPayment: string;
  files: string[];
}

export interface IChart1Data {
  monthlyPayment: number;
  quarterlyPayment: number;
  yearlyPayment: number;
  costsNextMonth: number;
}

export interface IChart2Data {
  insuranceCosts: {
    month: string;
    insurance: string;
    cost: number;
  }[];
}

export interface IGroupedData {
  [month: string]: {
    [insurance: string]: number;
  };
}
