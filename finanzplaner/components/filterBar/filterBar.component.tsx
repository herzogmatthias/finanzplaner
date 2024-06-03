"use client";
import { useFilters } from "@/context/filter.context";
import { Box, Button, HStack, Input, Stack } from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";

const FilterBar = () => {
  const { filters, handleFilterChange, resetFilters, notifySubscribers } =
    useFilters()!;

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
          placeholder="Search Text"
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
          options={[
            { value: "Account1", label: "Account 1" },
            { value: "Account2", label: "Account 2" },
          ]}
          size="sm"
          id="asdfasdf"
          placeholder="Accounts"
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
