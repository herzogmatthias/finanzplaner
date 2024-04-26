"use client";
import {
  Box,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdAccountBalance,
  MdDateRange,
  MdPayment,
  MdOutlineTrendingUp,
} from "react-icons/md";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsSankey from "highcharts/modules/sankey";
import { color } from "highcharts";

// Initialize the Sankey module
HighchartsSankey(Highcharts);

function GroupedSavingsPlans() {
  const plans: any[] = [
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
  const data = [
    ["Savings Account", "Bank A", 500],
    ["Bank A", "Car Loan", 200],
    ["Savings Account", "Bank B", 300],
    ["Bank B", "Home Loan", 300],
    // ...add more as needed
  ];
  // Group plans by accountName
  const groupedPlans = useMemo(() => {
    return plans.reduce((acc, plan) => {
      acc[plan.accountName] = acc[plan.accountName] || [];
      acc[plan.accountName].push(plan);
      return acc;
    }, {});
  }, [plans]);

  const options = {
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      headerFormat: null,
      pointFormat:
        "{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} " +
        "€",
      nodeFormat: "{point.name}: {point.sum:.2f} €",
    },
    series: [
      {
        keys: ["from", "to", "weight"],
        data: data,
        type: "sankey",
        name: "Geldfluss",
      },
    ],
    plotOptions: {
      series: {
        colorByPoint: true,
      },
      sankey: {
        color: ["red", "#FFC300", "#DAF7A6"],
      },
    },
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box ml={8} mt={8}>
      <Heading as="h1" size="xl" mb={6}>
        Sparpläne
      </Heading>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={cardBg}
        ml={8}
        mb={8}
        mr={12}
      >
        <Heading as="h2" size="lg">
          Geldfluss
        </Heading>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
      <SimpleGrid ml={8} columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
        {Object.entries(groupedPlans).map(([accountName, plans]) => (
          <Box
            key={accountName}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={cardBg}
          >
            <Flex alignItems="center" mb={4}>
              <Icon as={MdAccountBalance} w={8} h={8} color={iconColor} />
              <Heading size="lg" ml={3}>
                {accountName}
              </Heading>
            </Flex>
            {plans.map((plan) => (
              <Box
                key={plan.id}
                p={3}
                mt={3}
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue("gray.100", "gray.700")}
              >
                <Heading size="md" fontWeight="bold" mb={2}>
                  {plan.name}
                </Heading>
                <Flex alignItems="center" mb={1}>
                  <Icon
                    as={MdOutlineTrendingUp}
                    w={5}
                    h={5}
                    color={iconColor}
                  />
                  <Text fontSize="lg" ml={2} color={textColor}>
                    {plan.to}
                  </Text>
                </Flex>
                <Flex alignItems="center" mb={1}>
                  <Icon as={MdDateRange} w={5} h={5} color={iconColor} />
                  <Text fontSize="lg" ml={2} color={textColor}>
                    Next: {plan.nextPayment}
                  </Text>
                </Flex>
                <Flex alignItems="center" mb={1}>
                  <Icon as={MdPayment} w={5} h={5} color={iconColor} />
                  <Text fontSize="lg" ml={2} color={textColor}>
                    Rate: {plan.paymentrate}
                  </Text>
                </Flex>
                <Flex alignItems="center" mb={1}>
                  <Icon as={MdPayment} w={5} h={5} color={iconColor} />
                  <Text fontSize="lg" ml={2} color={textColor}>
                    Value: ${plan.value}
                  </Text>
                </Flex>
                <Divider my={3} />
                <Text fontSize="lg" color={textColor}>
                  Until: {plan.until}
                </Text>
              </Box>
            ))}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default GroupedSavingsPlans;
