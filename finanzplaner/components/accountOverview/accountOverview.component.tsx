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
import { BankAccountService } from "@/services/BankAccount.service";
import { IAccount } from "@/models/IAccount";
import { MdAccountBalanceWallet } from "react-icons/md";

const AccountOverview = () => {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const service = BankAccountService.getInstance();
        const data = await service.fetchAccounts();
        setAccounts(data);
      } catch (err) {
        setError("Fehler beim Laden der Konten");
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
          key={account.accountId}
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
              {account.accountName}
            </Text>
            <Text>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: localStorage.getItem("currency") || "EUR",
              }).format(account.balance)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {account.bankName}
            </Text>
          </Box>
          <Icon
            as={MdAccountBalanceWallet}
            w={8}
            h={8}
            mr={4}
            color="blue.500"
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default AccountOverview;
