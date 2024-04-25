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

const CreditDetails = ({
  annualRate,
  loanAmount,
  nextPaymentDate,
  otherFeesPA,
  startDate,
  term,
  totalAmount,
  effectiveRate,
}: ICreditDetails) => {
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
  const yearsPassed = currentDate.getFullYear() - startDate.getFullYear();
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualRate,
    term,
    otherFeesPA
  );
  const amountPaidBack = calculateAmountPaidBack(
    monthlyPayment,
    startDate,
    new Date() // assuming the current date is the date of calculation
  );

  const paidPercentage = (amountPaidBack / totalAmount) * 100;
  const yearsPassedPercentage = (yearsPassed / term) * 100;

  const formatCurrency = (amount: number) =>
    `${new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)}`;
  const formatPercentage = (percentage: number) =>
    `${percentage.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`;

  return (
    <Box p={4} boxShadow="md" borderRadius="md" bg="white">
      <VStack spacing={8} align="stretch">
        <DetailItem
          label="Kreditbetrag"
          value={formatCurrency(loanAmount)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Zinssatz"
          value={formatPercentage(annualRate)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Andere Kosten pro Jahr"
          value={formatCurrency(otherFeesPA)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Laufzeit"
          value={`${term} Jahre`}
          progress={yearsPassedPercentage}
          tooltipLabel={yearsPassed > 0 ? `${yearsPassed} Jahre` : "0 Jahre"}
        />
        <DetailItem
          label="Gesamtbetrag"
          value={formatCurrency(totalAmount)}
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
          value={nextPaymentDate.toLocaleDateString("de-DE")}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Effektiver Zinssatz"
          value={formatPercentage(effectiveRate)}
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
