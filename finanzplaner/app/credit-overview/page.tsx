"use client";
import CreditDetails from "@/components/creditDetails/creditDetails.component";
//import the necessary modules
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import React, { useState } from "react";

//create a functional react component
const CreditOverview = () => {
  const credits = ["Credit 1", "Credit 2", "Credit 3"];
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  return (
    <Box mt={8} ml={8}>
      <Heading as="h2" size={"lg"}>
        Kredite
      </Heading>
      <Box>
        <Box ml={4}>
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabList>
              {credits.map((credit, index) => {
                return <Tab key={index}>{credit}</Tab>;
              })}
            </TabList>
            <TabPanels>
              {credits.map((credit, index) => (
                <TabPanel key={index}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box flex={1}>
                      <CreditDetails creditName={credit}></CreditDetails>
                    </Box>
                    <Box>Chart</Box>
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
