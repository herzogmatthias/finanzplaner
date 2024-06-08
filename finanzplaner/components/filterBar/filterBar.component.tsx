"use client";
import { useFilters } from "@/context/filter.context";
import { BankAccountService } from "@/services/BankAccount.service";
import { Box, Button, HStack, Input, Stack } from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";
import { useEffect, useState } from "react";

const FilterBar = () => {
  const { filters, handleFilterChange, resetFilters, notifySubscribers } =
    useFilters()!;
  const [accounts, setAccounts] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const bankAccountService = BankAccountService.getInstance();
        const data = await bankAccountService.fetchBankAccounts();
        setAccounts(
          data.map((account) => ({
            value: account.accountId,
            label: account.accountId,
          }))
        );
      } catch (err) {
        console.error("Fehler beim Laden der Konten");
      }
    };

    fetchAccounts();
  }, []);
  return (
    <Box
      p={4}
      boxShadow={"md"}
      borderRadius="md"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      mr={4}
    >
      <HStack spacing={3} flex={1} mr={4}>
        <Input
          placeholder="Suche"
          value={filters.freeText}
          onChange={(e) => handleFilterChange("freeText", e.target.value)}
          size={"sm"}
        />
        <Input
          placeholder="BIC"
          type="text"
          value={filters.iban}
          onChange={(e) => handleFilterChange("iban", e.target.value)}
          size={"sm"}
        />
        <MultiSelect
          options={accounts}
          size="sm"
          id="asdfasdf"
          placeholder="Konten"
          value={filters.account}
          onChange={(e) => {
            console.log(e);
            handleFilterChange("account", Array.isArray(e) ? e : Array(e));
          }}
        ></MultiSelect>
        <Stack direction={["column", "row"]} spacing={3}>
          <Input
            placeholder="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            size={"sm"}
          />
          <Input
            placeholder="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            size={"sm"}
          />
        </Stack>
      </HStack>
      <HStack spacing={3}>
        <Button size={"sm"} colorScheme="blue" onClick={notifySubscribers}>
          Start
        </Button>
        <Button size={"sm"} colorScheme="gray" onClick={resetFilters}>
          Reset
        </Button>
      </HStack>
    </Box>
  );
};

export default FilterBar;
