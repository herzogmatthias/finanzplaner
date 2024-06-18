"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { addMonths, format } from "date-fns";
import "chartjs-adapter-date-fns";
import de from "date-fns/locale/de";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
} from "chart.js";
import withAuth from "@/middleware/withAuth.middleware";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
  TimeScale
);

const CreditSimulator = () => {
  // State for input values
  const [financingAmount, setFinancingAmount] = useState("");
  const [term, setTerm] = useState("");
  const [annualInterest, setAnnualInterest] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [residualDebt, setResidualDebt] = useState("");
  const [calculationResults, setCalculationResults] = useState({
    effectiveInterestRate: "*.**",
    monthlyRate: "**.**",
    interestExpense: "**.**",
    totalCreditCost: "**.**",
  });

  // State for chart data
  const [chartData, setChartData] = useState({
    labels: [] as any[],
    datasets: [
      {
        label: "Outstanding Credit",
        data: [] as any[],
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  });
  const calculateCredit = () => {
    const principal = parseFloat(financingAmount); // Total loan amount
    const yearlyNominalRate = parseFloat(annualInterest) / 100;
    const totalYears = parseInt(term, 10);
    const totalMonths = totalYears * 12;
    const residualDebtAmount = parseFloat(residualDebt || "0"); // Desired residual value
    const monthlyNominalRate = yearlyNominalRate / 12;
    const labels = [];
    const data = [];

    // Calculate the monthly payment that will leave the residual value at the end of the term
    let monthlyPayment =
      ((principal -
        residualDebtAmount / Math.pow(1 + monthlyNominalRate, totalMonths)) *
        monthlyNominalRate) /
      (1 - Math.pow(1 + monthlyNominalRate, -totalMonths));

    let balance = principal;
    let totalInterestPaid = 0;
    let currentDate = new Date();
    for (let month = 1; month <= totalMonths; month++) {
      const label = format(addMonths(currentDate, month - 1), "MM/yyyy");
      labels.push(label);
      let interestPayment = balance * monthlyNominalRate;
      let principalPayment = monthlyPayment - interestPayment;

      // Accumulate the interest paid
      totalInterestPaid += interestPayment;
      // Reduce the balance by the principal payment
      balance -= principalPayment;
      data.push(Math.abs(balance).toFixed(2));
    }

    // The total amount paid includes all payments plus the residual debt
    let totalPaid = monthlyPayment * totalMonths + residualDebtAmount;

    // Effective interest rate (annual) is calculated based on the nominal rate
    const effectiveInterestRate =
      (Math.pow(1 + monthlyNominalRate, 12) - 1) * 100;

    // Update the calculation results state
    setCalculationResults({
      monthlyRate: monthlyPayment.toFixed(2),
      interestExpense: totalInterestPaid.toFixed(2),
      totalCreditCost: totalPaid.toFixed(2),
      effectiveInterestRate: effectiveInterestRate.toFixed(2),
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Outstanding Credit",
          data,
          fill: false,
          backgroundColor: "rgb(54, 162, 235)",
          borderColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    });
  };

  return (
    <Flex direction="column" p={8}>
      <Heading as="h1" size="xl" mb={4}>
        Kreditsimulator
      </Heading>
      <Text mb={4}>
        Der Kreditzins bezeichnet die Kosten, die mit der Aufnahme eines
        Darlehens verbunden sind. Bezogen ist er auf die verbleibende Restschuld
        und angegeben wird er in Prozent pro Jahr (% p. a.). Mit unserem
        Kreditzinsrechner kannst du sämtliche dieser Kosten berechnen.
      </Text>
      <Flex>
        <Box flex="1" mr={4} boxShadow={"md"} p={5}>
          <Heading as="h2" size="lg" mb={4}>
            Daten
          </Heading>
          <VStack spacing={6}>
            <FormControl id="financingAmount" isRequired>
              <FormLabel>Finanzierungsbetrag</FormLabel>
              <Input
                type="number"
                value={financingAmount}
                onChange={(e) => setFinancingAmount(e.target.value)}
              />
            </FormControl>
            <FormControl id="term" isRequired>
              <FormLabel>Laufzeit</FormLabel>
              <Input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </FormControl>
            <FormControl id="annualInterest" isRequired>
              <FormLabel>Jahreszinssatz</FormLabel>
              <Input
                type="number"
                value={annualInterest}
                onChange={(e) => setAnnualInterest(e.target.value)}
              />
            </FormControl>
            <FormControl id="residualDebt">
              <FormLabel>Restschuld</FormLabel>
              <Input
                type="number"
                value={residualDebt}
                onChange={(e) => setResidualDebt(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={calculateCredit}>
              Jetzt Berechnen
            </Button>
          </VStack>
        </Box>
        <Box
          flex="1"
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Box mb={2} boxShadow={"md"} p={5}>
            <Heading as="h2" size="lg" mb={4}>
              Berechnung
            </Heading>
            <VStack spacing={4}>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <div>
                  <Text as={"b"}>Effektiver Zinssatz: </Text>
                </div>
                <div>
                  <Text as={"b"}>
                    {calculationResults.effectiveInterestRate}%
                  </Text>
                </div>
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <div>
                  <Text as={"b"}>Kreditrate (monatlich):</Text>
                </div>
                <div>
                  <Text as={"b"}>{calculationResults.monthlyRate} €</Text>
                </div>
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <div>
                  <Text as={"b"}>Zinsaufwand: </Text>
                </div>
                <div>
                  <Text as={"b"}>{calculationResults.interestExpense} €</Text>
                </div>
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <div>
                  <Text as={"b"}>Gesamtaufwand für den Kredit: </Text>
                </div>
                <div>
                  <Text as={"b"}>{calculationResults.totalCreditCost} €</Text>
                </div>
              </Box>
            </VStack>
          </Box>

          <Box
            mt={2}
            p={5}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="md"
          >
            <Heading as="h2" size="lg" mb={4} mt={8}>
              Verlauf
            </Heading>
            <div>
              <Line
                height={"200px"}
                width={"350px"}
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      type: "timeseries",
                      adapters: {
                        date: {
                          locale: de,
                        },
                      },
                      ticks: {
                        source: "auto",
                      },
                      time: {
                        parser: "MM/yyyy",
                        tooltipFormat: "MMMM yyyy",
                        unit: "month",
                      },
                    },
                    y: {
                      grid: {
                        display: true,
                      },
                      type: "linear",
                      display: true,
                      position: "left" as const,
                    },
                  },
                }}
              />
            </div>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default withAuth(CreditSimulator);
