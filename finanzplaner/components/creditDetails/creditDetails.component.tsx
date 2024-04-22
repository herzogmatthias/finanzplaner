import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { ICreditDetails } from "./ICreditDetails.props";
import { IDetailItem } from "./IDetailItem.props";

const CreditDetails = ({ creditName }: ICreditDetails) => {
  // Example props - replace with your actual fetching logic
  const creditData = {
    loanAmount: 100000, // The principal amount of the loan
    annualRate: 8, // Annual interest rate
    effectiveRate: 8.3, // Effective interest rate
    term: 40, // Term of the loan in years
    totalAmount: 123000, // Total amount to be repaid
    otherFeesPA: 1000, // Other fees
    startDate: new Date("2021-01-01"), // Start date of the loan
    paymentRate: "monthly", // Payment frequency
    nextPaymentDate: new Date("2021-02-01"), // Next payment date
  };
  const calculateMonthlyPayment = (
    loanAmount: number,
    annualRate: number,
    term: number,
    otherFeesPA: number
  ) => {
    const monthlyRate = annualRate / 12 / 100; // convert annual rate to a monthly and percentage
    const totalPayments = term * 12; // total number of monthly payments

    // Monthly payment calculation using the formula for an annuity
    // P = [r*PV] / [1 - (1 + r)^(-n)]
    // Where:
    // P = payment
    // r = monthly interest rate
    // PV = present value (loanAmount)
    // n = total number of payments
    const monthlyPayment =
      (monthlyRate * loanAmount) /
      (1 - Math.pow(1 + monthlyRate, -totalPayments));

    // Adding other annual fees spread out over the monthly payments
    const monthlyFees = otherFeesPA / 12;

    return monthlyPayment + monthlyFees;
  };
  const calculateAmountPaidBack = (
    monthlyPayment: number,
    startDate: Date,
    currentDate: Date
  ) => {
    // Calculate the number of full months between the start date and the current date
    const start = startDate;
    const now = currentDate;
    let months = (now.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += now.getMonth();

    // Ensure that we do not count partial months if the current date is before the payment date
    if (now.getDate() < start.getDate()) {
      months--;
    }

    return monthlyPayment * months; // Total amount paid back so far
  };

  //calculate years passed
  const currentDate = new Date();
  const yearsPassed =
    currentDate.getFullYear() - creditData.startDate.getFullYear();
  const monthlyPayment = calculateMonthlyPayment(
    creditData.loanAmount,
    creditData.annualRate,
    creditData.term,
    creditData.otherFeesPA
  );
  const amountPaidBack = calculateAmountPaidBack(
    monthlyPayment,
    creditData.startDate,
    new Date() // assuming the current date is the date of calculation
  );

  const paidPercentage = (amountPaidBack / creditData.totalAmount) * 100;
  const yearsPassedPercentage = (yearsPassed / creditData.term) * 100;

  const formatCurrency = (amount: number) =>
    `€ ${amount.toLocaleString("de-DE", { maximumFractionDigits: 2 })}`;
  const formatPercentage = (percentage: number) =>
    `${percentage.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`;

  return (
    <Box p={4} boxShadow="md" borderRadius="md" bg="white">
      <VStack spacing={8} align="stretch">
        <DetailItem
          label="Kreditbetrag"
          value={formatCurrency(creditData.loanAmount)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Zinssatz"
          value={formatPercentage(creditData.annualRate)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Andere Kosten pro Jahr"
          value={formatCurrency(creditData.otherFeesPA)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Laufzeit"
          value={`${creditData.term} Jahre`}
          progress={yearsPassedPercentage}
          tooltipLabel={yearsPassed > 0 ? `${yearsPassed} Jahre` : "0 Jahre"}
        />
        <DetailItem
          label="Gesamtbetrag"
          value={formatCurrency(creditData.totalAmount)}
          progress={paidPercentage}
          tooltipLabel={formatCurrency(amountPaidBack)}
        />
      </VStack>

      <VStack mt={6} spacing={0} align="stretch">
        <DetailItem
          label="Monatlicher Betrag"
          value={formatCurrency(monthlyPayment)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Nächster Zahlungstermin"
          value={creditData.nextPaymentDate.toLocaleDateString("de-DE")}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Effektiver Zinssatz"
          value={formatPercentage(creditData.effectiveRate)}
          progress={0}
          tooltipLabel={""}
        />
      </VStack>
    </Box>
  );
};

const DetailItem = ({ label, value, progress, tooltipLabel }: IDetailItem) => (
  <Box>
    <Flex justify="space-between" align="center" mb={2}>
      <Text fontWeight="semibold">{label}</Text>
      <Flex align="center">
        <Text minWidth="120px" textAlign="right">
          {value}
        </Text>
      </Flex>
    </Flex>
    {progress > 0 && (
      <Slider aria-label={`${label} slider`} value={progress} isReadOnly>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip hasArrow label={tooltipLabel} bg="blue.600">
          <SliderThumb />
        </Tooltip>
      </Slider>
    )}
  </Box>
);

export default CreditDetails;
