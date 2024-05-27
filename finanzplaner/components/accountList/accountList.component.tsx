"use client";
import { Box, Button, Heading, List, ListItem, Flex, IconButton, useToast } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

const AccountList = () => {
    const [accounts, setAccounts] = useState([
        { id: 1, name: "Girokonto" },
        { id: 2, name: "Sparen" },
    ]);

    const toast = useToast();

    const deleteAccount = (id:number) => {
        const updatedAccounts = accounts.filter(account => account.id !== id);
        setAccounts(updatedAccounts);
        toast({
            title: "Account deleted.",
            description: "The account has been removed successfully.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const deleteAllAccounts = () => {
        setAccounts([]);
        toast({
            title: "All accounts deleted.",
            description: "All linked accounts have been removed.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box bg="white" p={5} boxShadow="md" borderRadius="md">
            <Heading size="md" mb={4}>Your Accounts</Heading>
            <List spacing={3}>
                {accounts.map(account => (
                    <ListItem key={account.id} display="flex" justifyContent="space-between" alignItems="center">
                        {account.name}
                        <IconButton
                            aria-label="Delete account"
                            icon={<CloseIcon />}
                            onClick={() => deleteAccount(account.id)}
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
