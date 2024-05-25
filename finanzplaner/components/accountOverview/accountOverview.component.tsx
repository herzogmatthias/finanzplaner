"use client";
import {
  Box,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AccountService, { Account } from "@/services/Account.service";

const AccountOverview = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const service = AccountService.getInstance();
        const data = await service.fetchAccounts();
        setAccounts(data);
      } catch (err) {
        setError("Failed to fetch accounts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) {
    return (
      <SimpleGrid columns={6} spacing={10}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Box
              key={index}
              p={4}
              bg="white"
              boxShadow="md"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Skeleton height="20px" width="100px" mb={2} />
                <Skeleton height="20px" width="80px" />
                <Skeleton height="20px" width="60px" mt={2} />
              </Box>
              <Skeleton height="32px" width="32px" />
            </Box>
          ))}
      </SimpleGrid>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={6} spacing={10}>
      {accounts.map((account) => (
        <Box
          key={account.id}
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {account.name}
            </Text>
            <Text>{account.balance}</Text>
            <Text fontSize="sm" color="gray.500">
              {account.bank}
            </Text>
          </Box>
          <Icon as={account.icon} w={8} h={8} mr={4} color="blue.500" />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default AccountOverview;
