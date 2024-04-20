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

const options: ChartOptions = {};

const CreditSimulator = () => {
  // State for input values
  const [financingAmount, setFinancingAmount] = useState("");
  const [term, setTerm] = useState("");
  const [annualInterest, setAnnualInterest] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [residualDebt, setResidualDebt] = useState("");

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
    const monthlyInterestRate = parseFloat(annualInterest) / 100 / 12;
    const totalMonths = parseInt(term, 10) * 12;
    let initialBalance = parseFloat(financingAmount);
    let additionalCosts = parseFloat(otherCosts || "0");
    let balance = initialBalance + additionalCosts;
    const residualDebtAmount = parseFloat(residualDebt || "0");
    let monthlyRate =
      (balance * monthlyInterestRate) /
      (1 - Math.pow(1 / (1 + monthlyInterestRate), totalMonths));

    let reachedResidual = false;

    const labels = [];
    const data = [];
    let currentDate = new Date();

    for (let month = 1; month <= totalMonths; month++) {
      const label = format(addMonths(currentDate, month), "MM/yyyy");
      labels.push(label);
      let interestForThisMonth = balance * monthlyInterestRate;
      let principalForThisMonth = monthlyRate - interestForThisMonth;

      if (balance - principalForThisMonth <= residualDebtAmount) {
        principalForThisMonth = balance - residualDebtAmount; // Adjust principal to not go below residual debt
        reachedResidual = true; // Mark that we've reached residual debt
      }

      balance -= principalForThisMonth;
      data.push(balance.toFixed(2));

      if (reachedResidual) {
        break; // Stop the loop
      }
    }

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
          <VStack spacing={4}>
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
            <FormControl id="otherCosts">
              <FormLabel>Andere Kosten</FormLabel>
              <Input
                type="number"
                value={otherCosts}
                onChange={(e) => setOtherCosts(e.target.value)}
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
          <Box boxShadow={"md"} p={5}>
            <Heading as="h2" size="lg" mb={4}>
              Berechnung
            </Heading>
            {/* Placeholder for calculation results */}
            {/* ... */}
          </Box>

          <Box p={5} bg={useColorModeValue("white", "gray.700")} boxShadow="md">
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

export default CreditSimulator;
