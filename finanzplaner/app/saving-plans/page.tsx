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
import { IStandingOrder } from "@/models/IStandingOrder";
import { StandingOrdersService } from "@/services/StandingOrders.service";

// Initialize the Sankey module
HighchartsSankey(Highcharts);

interface IPlanCardProps {
  accountName: string;
  plans: IStandingOrder[];
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
        key={plan.orderId}
        plan={plan}
        textColor={textColor}
        iconColor={iconColor}
      />
    ))}
  </Box>
);

interface IPlanDetailsProps {
  plan: IStandingOrder;
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
      {plan.reference}
    </Heading>
    <Flex alignItems="center" mb={1}>
      <Icon as={MdOutlineTrendingUp} w={5} h={5} color={iconColor} />
      <Text fontSize="lg" ml={2} color={textColor}>
        To: {plan.issuer}
      </Text>
    </Flex>
    <Flex alignItems="center" mb={1}>
      <Icon as={MdDateRange} w={5} h={5} color={iconColor} />
      <Text fontSize="lg" ml={2} color={textColor}>
        Next: {new Date(plan.nextPayment).toLocaleDateString()}
      </Text>
    </Flex>
    <Flex alignItems="center" mb={1}>
      <Icon as={MdPayment} w={5} h={5} color={iconColor} />
      <Text fontSize="lg" ml={2} color={textColor}>
        Amount: {plan.paymentAmount} {plan.paymentCurrency}
      </Text>
    </Flex>
    <Divider my={3} />
    <Text fontSize="lg" color={textColor}>
      Until: {new Date(plan.finalPaymentDateTime).toLocaleDateString()}
    </Text>
  </Box>
);

function GroupedSavingsPlans() {
  const [plans, setPlans] = useState<IStandingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const service = StandingOrdersService.getInstance();
        const fetchedPlans = await service.fetchStandingOrders();
        setPlans(fetchedPlans);
      } catch (err) {
        setError("Error fetching standing orders.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const data = plans.flatMap((plan) => [
    [plan.creditorAccountId, plan.issuer, plan.paymentAmount],
  ]);

  const groupedPlans = useMemo(() => {
    return plans.reduce<Record<string, IStandingOrder[]>>((acc, plan) => {
      acc[plan.creditorAccountId] = acc[plan.creditorAccountId] || [];
      acc[plan.creditorAccountId].push(plan);
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
        localStorage.getItem("currency"),
      nodeFormat:
        "{point.name}: {point.sum:.2f} " + localStorage.getItem("currency"),
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
      <SimpleGrid ml={8} mr={12} columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
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
