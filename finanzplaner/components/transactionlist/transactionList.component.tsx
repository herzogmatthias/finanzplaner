"use client";
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
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { IFilters, useFilters } from "@/context/filter.context"; // Import the filter context hook
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ITransaction } from "@/models/ITransaction";
import AccountService from "@/services/Account.service";

const TransactionList = () => {
  const { subscribe } = useFilters()!;
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const fetchData = async (filters: IFilters) => {
    setIsLoading(true);
    setError(null);
    setFirstRender(false);
    try {
      const service = AccountService.getInstance();
      const result = await service.fetchTransactionData(filters);
      setTransactions(result);
    } catch (err) {
      console.log(err);
      setError(
        "Fehler beim Laden der Transaktionen. Bitte versuche es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribe((filters) => {
      fetchData(filters);
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const groupedTransactions: [string, ITransaction[]][] = useMemo(() => {
    const groups = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.bookingDateTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, ITransaction[]>);
    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [transactions]);

  if (isLoading) {
    return (
      <Box w="full" p={5}>
        <Skeleton height="50px" mb={4} />
        <Skeleton height="50px" mb={4} />
        <Skeleton height="50px" mb={4} />
        <Skeleton height="50px" mb={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="full" p={5}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }
  if (groupedTransactions.length === 0 && firstRender) {
    return (
      <Box>
        <Alert status="info">
          <AlertIcon />
          Bitte drücke Start um die Transaktionen zu laden.
        </Alert>
      </Box>
    );
  }

  if (groupedTransactions.length === 0 && !firstRender) {
    return (
      <Box w="full" p={5}>
        <Alert status="warning">
          <AlertIcon />
          Keine Transaktionen gefunden.
        </Alert>
      </Box>
    );
  }

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
                    Konto ID (Transaktion ID): {item.accountId} (
                    {item.transactionId})
                  </Text>
                  <Text>Details: {item.transactionInformation}</Text>
                  <Flex align="center">
                    <Text fontSize="sm" mr={2}>
                      Betrag:
                    </Text>
                    <Tag
                      size="lg"
                      colorScheme={item.amount >= 0 ? "green" : "red"}
                    >
                      {item.amountCurrency == "EUR" ? "€" : "$"}
                      {Math.abs(item.amount)}
                    </Tag>
                  </Flex>
                </VStack>
                <VStack align="end">
                  <Tag colorScheme={item.amount >= 0 ? "green" : "red"}>
                    {item.amount >= 0 ? "Einnahme" : "Ausgabe"}
                  </Tag>
                  <Text fontSize="sm">Empfänger: {item.merchantName}</Text>
                  <Text fontSize="sm">Sender: {item.transactionIssuer}</Text>
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
