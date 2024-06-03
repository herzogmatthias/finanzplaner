"use client";
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  Flex,
  IconButton,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { IBankAccount } from "@/models/IBankAccount";
import { BankAccountService } from "@/services/BankAccount.service";

const AccountList = () => {
  const [accounts, setAccounts] = useState<IBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = BankAccountService.getInstance();
      const fetchedAccounts = await service.fetchBankAccounts();
      setAccounts(fetchedAccounts);
    } catch (err) {
      setError("Failed to load accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const deleteAccount = async (id: number, accountId: string) => {
    setIsLoading(true);
    try {
      const service = BankAccountService.getInstance();
      await service.deleteOneBankAccount(id, accountId);
      await fetchAccounts();
      toast({
        title: "Account deleted.",
        description: "The account has been removed successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const deleteAllAccounts = async () => {
    setIsLoading(true);
    try {
      const service = BankAccountService.getInstance();
      await service.deleteAllBankAccounts();
      await fetchAccounts();
      toast({
        title: "All accounts deleted.",
        description: "All linked accounts have been removed.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete all accounts.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box bg="white" p={5} boxShadow="md" borderRadius="md">
      <Heading size="md" mb={4}>
        Your Accounts
      </Heading>
      <List spacing={3}>
        {accounts.map((account) => (
          <ListItem
            key={account.accountId}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {account.bankId} - {account.accountId}
            <IconButton
              aria-label="Delete account"
              icon={<CloseIcon />}
              onClick={() => deleteAccount(account.bankId, account.accountId)}
            />
          </ListItem>
        ))}
      </List>
      {accounts.length > 0 && (
        <Button mt={4} colorScheme="red" onClick={deleteAllAccounts}>
          Delete All Accounts
        </Button>
      )}
    </Box>
  );
};

export default AccountList;
