export interface IAdditionalInformation {
  description: string;
  value: string;
}

export interface IInsurance {
  id: number;
  iban: string;
  insuranceCompany: string;
  name: string;
  paymentrate: string;
  payment: number;
  startdate: string;
  isPaused: boolean;
  additionalInformation: IAdditionalInformation[];
  nextPayment: string;
  files: string[];
}

export interface IChart1Data {
  monthlyPayment: number;
  quarterPayment: number;
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
