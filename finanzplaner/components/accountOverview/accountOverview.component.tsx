"use client";
import { Box, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { MdAccountBalance, MdAccountBalanceWallet } from "react-icons/md";

const accounts = [
  {
    id: 1,
    name: "Girokonto",
    balance: "768.39€",
    bank: "Bank #1",
    icon: MdAccountBalanceWallet, // Wallet icon for a personal account
  },
  {
    id: 2,
    name: "Sparen",
    balance: "768.39€",
    bank: "Bank #2",
    icon: MdAccountBalance, // Bank icon for savings account
  },
];

const AccountOverview = () => {
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
