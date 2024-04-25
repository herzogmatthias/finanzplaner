"use client";
import CreditChart from "@/components/creditChart/creditChart.component";
import CreditDetails from "@/components/creditDetails/creditDetails.component";
import { ICredit } from "@/models/ICredit";
//import the necessary modules
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

//create a functional react component
const CreditOverview = () => {
  const credits = ["Credit 1", "Credit 2", "Credit 3"];
  const [tabIndex, setTabIndex] = useState(0);
  const [creditData, setCreditData] = useState<ICredit | null>(null);

  useEffect(() => {
    //fetch the credit data
    //replace with actual fetching logic
    const creditData = {
      creditName: "Credit 1",
      iban: "DE123456789",
      loanAmount: 100000,
      annualRate: 8,
      effectiveRate: 8.3,
      term: 40,
      otherFeesPA: 1000,
      totalAmount: 123000,
      nextPaymentDate: new Date(),
      documents: ["Document 1", "Document 2"],
      paymentRate: "monthly",
      startDate: new Date("2021-01-01"),
    };
    setCreditData(creditData);
  }, []);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Box mt={8} ml={8}>
      <Heading as="h2" size={"lg"}>
        Kredite
      </Heading>

      <Box>
        <Box ml={4} mr={4}>
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mr={4}
            >
              <Box flex={1}>
                <TabList width={"80%"}>
                  {credits.map((credit, index) => {
                    return <Tab key={index}>{credit}</Tab>;
                  })}
                </TabList>
              </Box>
              <Box>
                <ButtonGroup isAttached variant={"outline"}>
                  <Button colorScheme="blue">Ändern</Button>
                  <Button colorScheme="blue">Löschen</Button>
                  <Menu>
                    <MenuButton
                      colorScheme="blue"
                      as={Button}
                      rightIcon={
                        <Icon size={"lg"} as={MdOutlineKeyboardArrowDown} />
                      }
                    >
                      Dokumente ({creditData?.documents.length || 0})
                    </MenuButton>
                    <MenuList>
                      {creditData?.documents.map((document, index) => (
                        <MenuItem key={index}>{document}</MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </ButtonGroup>
              </Box>
            </Box>

            <TabPanels>
              {credits.map((credit, index) => (
                <TabPanel key={index}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box flex={1}>
                      {creditData && (
                        <CreditDetails {...creditData}></CreditDetails>
                      )}
                    </Box>
                    <Box
                      ml={10}
                      p={4}
                      boxShadow="md"
                      borderRadius="md"
                      bg="white"
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {creditData && (
                        <CreditChart {...creditData}></CreditChart>
                      )}
                    </Box>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
};

export default CreditOverview;
