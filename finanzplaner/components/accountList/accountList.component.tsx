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
      setError("Fehler beim Laden der Konten");
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
        title: "Konto gelöscht",
        description: "Das Konto wurde erfolgreich gelöscht.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen des Kontos.",
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
        title: "Alle Konten gelöscht.",
        description: "Alle verknüpften Konten wurden erfolgreich gelöscht.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen der Konten.",
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
        Deine Konten
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
          Löschen aller Konten
        </Button>
      )}
    </Box>
  );
};

export default AccountList;
