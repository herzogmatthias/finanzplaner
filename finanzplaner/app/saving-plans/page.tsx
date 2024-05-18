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
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  MdAccountBalance,
  MdDateRange,
  MdPayment,
  MdOutlineTrendingUp,
} from "react-icons/md";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsSankey from "highcharts/modules/sankey";
import { ISavingPlan } from "@/models/ISavingPlan";
import { SavingPlanService } from "@/services/SavingPlan.service";

// Initialize the Sankey module
HighchartsSankey(Highcharts);

interface IPlanCardProps {
  accountName: string;
  plans: ISavingPlan[];
  cardBg: string;
  textColor: string;
  iconColor: string;
}

const PlanCard = ({
  accountName,
  plans,
  cardBg,
  textColor,
  iconColor,
}: IPlanCardProps) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
    <Flex alignItems="center" mb={4}>
      <Icon as={MdAccountBalance} w={8} h={8} color={iconColor} />
      <Heading size="lg" ml={3}>
        {accountName}
      </Heading>
    </Flex>
    {plans.map((plan) => (
      <PlanDetails
        key={plan.id}
        plan={plan}
        textColor={textColor}
        iconColor={iconColor}
      />
    ))}
  </Box>
);

interface IPlanDetailsProps {
  plan: ISavingPlan;
  textColor: string;
  iconColor: string;
}

const PlanDetails = ({ plan, textColor, iconColor }: IPlanDetailsProps) => (
  <Box
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
      <Icon as={MdOutlineTrendingUp} w={5} h={5} color={iconColor} />
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
);

function GroupedSavingsPlans() {
  const [plans, setPlans] = useState<ISavingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const service = SavingPlanService.getInstance();
        const fetchedPlans = await service.fetchPlans();
        setPlans(fetchedPlans);
      } catch (err) {
        setError("Error fetching savings plans.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const data = plans.flatMap((plan) => [
    [plan.accountName, plan.from, plan.value],
    [plan.from, plan.to, plan.value],
  ]);

  const groupedPlans = useMemo(() => {
    return plans.reduce<Record<string, ISavingPlan[]>>((acc, plan) => {
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
        "{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} €",
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

  if (error) {
    return (
      <Box ml={8} mt={8}>
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box ml={8} mt={8}>
      <Heading as="h1" size="xl" mb={6}>
        Sparpläne
      </Heading>
      <Skeleton isLoaded={!isLoading} ml={8} mb={8} mr={12}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
          <Heading as="h2" size="lg">
            Geldfluss
          </Heading>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
      </Skeleton>
      <SimpleGrid ml={8} columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} height="300px" />
            ))
          : Object.entries(groupedPlans).map(([accountName, plans]) => (
              <PlanCard
                key={accountName}
                accountName={accountName}
                plans={plans}
                cardBg={cardBg}
                textColor={textColor}
                iconColor={iconColor}
              />
            ))}
      </SimpleGrid>
    </Box>
  );
}

export default GroupedSavingsPlans;
