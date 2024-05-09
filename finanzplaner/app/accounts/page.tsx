"use client";
import AccountOverview from "@/components/accountOverview/accountOverview.component";
import AssetsAreaChart from "@/components/assetsareachart/assetsAreaChart.component";
import FilterBar from "@/components/filterBar/filterBar.component";
import RevenueExpenditureChart from "@/components/revenueexpendeturechart/revenueExpendentureChart.component";
import TransactionList from "@/components/transactionlist/transactionList.component";
import { Box, Heading } from "@chakra-ui/react";

const Accounts = () => {
  return (
    <Box mt={8} ml={8}>
      <FilterBar />
      <Box mt={8}>
        <Heading as="h2" size={"xl"} mb={4}>
          Konten
        </Heading>
        <AccountOverview />
      </Box>
      <Box mt={8} display={"flex"} justifyContent={"space-between"} mr={4}>
        <Box p={4} boxShadow={"md"} flex={1} mr={4}>
          <Heading as="h2" size={"lg"} mb={4} mt={3} ml={2}>
            Einnahmen/Ausgaben
          </Heading>
          <Box minWidth={350} height={300}>
            <RevenueExpenditureChart />
          </Box>
        </Box>
        <Box p={4} boxShadow={"md"} flex={1} ml={4}>
          <Heading as="h2" size={"lg"} mb={4} mt={3} ml={2}>
            Vermögen
          </Heading>
          <Box minWidth={350} height={300}>
            <AssetsAreaChart />
          </Box>
        </Box>
      </Box>
      <Box mt={8}>
        <TransactionList></TransactionList>
      </Box>
    </Box>
  );
};

export default Accounts;
