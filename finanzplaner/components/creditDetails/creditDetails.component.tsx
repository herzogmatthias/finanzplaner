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
import { ICredit } from "@/models/ICredit";

const CreditDetails = ({
  interestRate,
  loanAmount,
  nextPaymentDate,
  additionalCosts,
  startDate,
  endDate,
  totalAmount,
  effectiveRate,
  loanUnitCurrency,
}: ICredit) => {
  const term =
    new Date(endDate).getFullYear() - new Date(startDate).getFullYear();

  const calculateMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    term: number,
    otherFeesPA: number
  ) => {
    const monthlyRate = interestRate / 12 / 100; // convert annual rate to a monthly and percentage
    const totalPayments = term * 12; // total number of monthly payments

    // Monthly payment calculation using the formula for an annuity
    const monthlyPayment =
      (monthlyRate * loanAmount) /
      (1 - Math.pow(1 + monthlyRate, -totalPayments));

    // Adding other annual fees spread out over the monthly payments
    const monthlyFees = otherFeesPA / 12;

    return monthlyPayment + monthlyFees;
  };

  const calculateAmountPaidBack = (
    monthlyPayment: number,
    startDate: string,
    currentDate: Date
  ) => {
    const start = new Date(startDate);
    const now = currentDate;
    let months = (now.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += now.getMonth();

    if (now.getDate() < start.getDate()) {
      months--;
    }

    return monthlyPayment * months; // Total amount paid back so far
  };

  const calculateTotalAmountToBePaidBack = (
    loanAmount: number,
    interestRate: number,
    term: number,
    otherFeesPA: number
  ) => {
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      term,
      otherFeesPA
    );
    return monthlyPayment * term * 12; // Total amount paid over the loan term
  };

  const currentDate = new Date();
  const yearsPassed =
    currentDate.getFullYear() - new Date(startDate).getFullYear();
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    interestRate,
    term,
    additionalCosts
  );
  const amountPaidBack = calculateAmountPaidBack(
    monthlyPayment,
    startDate,
    new Date() // assuming the current date is the date of calculation
  );

  const totalAmountToBePaidBack = calculateTotalAmountToBePaidBack(
    loanAmount,
    interestRate,
    term,
    additionalCosts
  );

  const paidPercentage = (amountPaidBack / totalAmountToBePaidBack) * 100;
  const yearsPassedPercentage = (yearsPassed / term) * 100;

  const formatCurrency = (amount: number) =>
    `${new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: loanUnitCurrency,
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
          value={formatPercentage(interestRate)}
          progress={0}
          tooltipLabel={""}
        />
        <DetailItem
          label="Andere Kosten pro Jahr"
          value={formatCurrency(additionalCosts)}
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
          value={formatCurrency(totalAmountToBePaidBack)}
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
          value={/*new Date(nextPaymentDate).toLocaleDateString("de-DE")*/ ""}
          progress={0}
          tooltipLabel={""}
        />
      </VStack>
    </Box>
  );
};

interface IDetailItemProps {
  label: string;
  value: string;
  progress: number;
  tooltipLabel: string;
}

const DetailItem = ({
  label,
  value,
  progress,
  tooltipLabel,
}: IDetailItemProps) => (
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
