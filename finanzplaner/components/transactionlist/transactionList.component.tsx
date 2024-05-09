// components/VirtualizedTransactionList.js
import { useMemo, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  Box,
  Text,
  VStack,
  Divider,
  Badge,
  Flex,
  Icon,
  Tag,
} from "@chakra-ui/react";
import { IFilters, useFilters } from "@/context/filter.context"; // Import the filter context hook
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TransactionList = () => {
  const { subscribe } = useFilters()!;
  const [transactions, setTransactions] = useState<any[]>([]);

  // Simulate fetching data based on filters
  const fetchData = (filters: IFilters) => {
    // Simulated fetch logic
    console.log("Fetching transactions with filters:", filters);
    // Simulated response (replace with actual API call logic)
    const filteredData = [
      {
        transactionId: "T1003",
        details: "Web hosting fee",
        bookedOn: "2023-05-01",
        amount: -150,
        receiver: "Hosting Services Inc.",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1004",
        details: "Office rent payment",
        bookedOn: "2023-05-05",
        amount: -2000,
        receiver: "Real Estate LLC",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1005",
        details: "Consultancy fees received",
        bookedOn: "2023-05-10",
        amount: 1200,
        receiver: "Our Company",
        sender: "Startup Inc.",
        type: "revenue",
      },
      {
        transactionId: "T1006",
        details: "Payment for freelance services",
        bookedOn: "2023-05-12",
        amount: -350,
        receiver: "Freelancer Jane Doe",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1007",
        details: "Sale of old office equipment",
        bookedOn: "2023-05-15",
        amount: 450,
        receiver: "Our Company",
        sender: "Second Hand Office",
        type: "revenue",
      },
      {
        transactionId: "T1008",
        details: "Subscription service fee",
        bookedOn: "2023-05-18",
        amount: -99,
        receiver: "Software as a Service",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1009",
        details: "Coffee and supplies",
        bookedOn: "2023-05-20",
        amount: -85,
        receiver: "Office Supplies Store",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1010",
        details: "Electricity bill payment",
        bookedOn: "2023-05-22",
        amount: -220,
        receiver: "Energy Provider",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1011",
        details: "Income from investment",
        bookedOn: "2023-05-25",
        amount: 1500,
        receiver: "Our Company",
        sender: "Investment Fund",
        type: "revenue",
      },
      {
        transactionId: "T1012",
        details: "Income tax payment",
        bookedOn: "2023-06-01",
        amount: -1200,
        receiver: "Tax Office",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1013",
        details: "Client project payment received",
        bookedOn: "2023-06-05",
        amount: 2400,
        receiver: "Our Company",
        sender: "Global Corp",
        type: "revenue",
      },
      {
        transactionId: "T1014",
        details: "Water supply bill",
        bookedOn: "2023-06-07",
        amount: -110,
        receiver: "Water Company",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1015",
        details: "Staff bonus payments",
        bookedOn: "2023-06-10",
        amount: -2500,
        receiver: "Employees",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1016",
        details: "Received payment for consultancy",
        bookedOn: "2023-06-15",
        amount: 1800,
        receiver: "Our Company",
        sender: "Tech Innovations",
        type: "revenue",
      },
      {
        transactionId: "T1017",
        details: "Office furniture purchase",
        bookedOn: "2023-06-18",
        amount: -750,
        receiver: "Furniture Mart",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1018",
        details: "Marketing service fee",
        bookedOn: "2023-06-20",
        amount: -600,
        receiver: "Marketing Agency",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1019",
        details: "Dividend received",
        bookedOn: "2023-06-22",
        amount: 500,
        receiver: "Our Company",
        sender: "Stock Market",
        type: "revenue",
      },
      {
        transactionId: "T1020",
        details: "Refund from supplier",
        bookedOn: "2023-06-25",
        amount: 300,
        receiver: "Our Company",
        sender: "Supplier Inc.",
        type: "revenue",
      },
      {
        transactionId: "T1021",
        details: "Legal services fee",
        bookedOn: "2023-06-28",
        amount: -430,
        receiver: "Legal Firm",
        sender: "Our Company",
        type: "expenditure",
      },
      {
        transactionId: "T1022",
        details: "Project completion bonus to employees",
        bookedOn: "2023-06-30",
        amount: -1500,
        receiver: "Employees",
        sender: "Our Company",
        type: "expenditure",
      },
    ];
    setTransactions(filteredData); // Set the simulated data
  };

  useEffect(() => {
    const unsubscribe = subscribe((filters) => {
      fetchData(filters);
    });
    return unsubscribe; // Cleanup on unmount
  });

  // Group transactions by booking date
  const groupedTransactions: [string, any][] = useMemo(() => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = transaction.bookedOn;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [transactions]);

  return (
    <Box w="full" maxHeight={500} overflowY={"auto"} p={5}>
      {groupedTransactions.map(([date, items], index) => (
        <VStack key={index} align="stretch" mb={5}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {date}
          </Text>
          {items.map((item, idx) => (
            <Box key={idx} p={3} bg="white" boxShadow="md" borderRadius="lg">
              <Flex justify="space-between" align="center">
                <Icon
                  as={item.amount >= 0 ? FaArrowUp : FaArrowDown}
                  color={item.amount >= 0 ? "green.500" : "red.500"}
                  boxSize={6}
                  mr={4}
                />
                <VStack align="start" flex="1">
                  <Text fontWeight="bold">
                    Transaction ID: {item.transactionId}
                  </Text>
                  <Text>Details: {item.details}</Text>
                  <Flex align="center">
                    <Text fontSize="sm" mr={2}>
                      Amount:
                    </Text>
                    <Tag
                      size="lg"
                      colorScheme={item.amount >= 0 ? "green" : "red"}
                    >
                      €{Math.abs(item.amount)}
                    </Tag>
                  </Flex>
                </VStack>
                <VStack align="end">
                  <Tag colorScheme={item.amount >= 0 ? "green" : "red"}>
                    {item.amount >= 0 ? "Revenue" : "Expenditure"}
                  </Tag>
                  <Text fontSize="sm">Receiver: {item.receiver}</Text>
                  <Text fontSize="sm">Sender: {item.sender}</Text>
                </VStack>
              </Flex>
              <Divider mt={3} />
            </Box>
          ))}
        </VStack>
      ))}
    </Box>
  );
};

export default TransactionList;
