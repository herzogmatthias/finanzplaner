"use client";
import CreditChart from "@/components/creditChart/creditChart.component";
import CreditDetails from "@/components/creditDetails/creditDetails.component";
import { ICredit } from "@/models/ICredit";
import CreditService from "@/services/Credit.service";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonText,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const CreditOverview = () => {
  const router = useRouter();
  const [credits, setCredits] = useState<{ creditName: string; id: number }[]>(
    []
  );
  const [tabIndex, setTabIndex] = useState(0);
  const [creditData, setCreditData] = useState<ICredit | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [isLoadingCreditData, setIsLoadingCreditData] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [creditDataError, setCreditDataError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      setIsLoadingCredits(true);
      setCreditsError(null);
      try {
        const service = CreditService.getInstance();
        const fetchedCredits = await service.fetchCredits();
        setCredits(fetchedCredits);
        if (fetchedCredits.length > 0) {
          fetchCreditDetails(fetchedCredits[0].id);
        }
      } catch (err) {
        setCreditsError("Error fetching credits.");
      } finally {
        setIsLoadingCredits(false);
      }
    };

    fetchCredits();
  }, []);
  const fetchCreditDetails = async (id: number) => {
    setIsLoadingCreditData(true);
    setCreditDataError(null);
    try {
      const service = CreditService.getInstance();
      const fetchedCreditData = await service.fetchCreditDetails(id);
      setCreditData(fetchedCreditData);
    } catch (err) {
      setCreditDataError("Error fetching credit details.");
    } finally {
      setIsLoadingCreditData(false);
    }
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    fetchCreditDetails(credits[index].id);
  };

  if (isLoadingCredits) {
    return (
      <Box mt={8} ml={8}>
        <Skeleton height="40px" width="200px" mb={4} />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    );
  }

  if (creditsError) {
    return (
      <Box mt={8} ml={8}>
        <Alert status="error">
          <AlertIcon />
          {creditsError}
        </Alert>
      </Box>
    );
  }

  if (credits.length === 0) {
    return (
      <Box mt={8} ml={8}>
        <Heading as="h2" size={"lg"}>
          Keine Kredite verfügbar
        </Heading>
      </Box>
    );
  }

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
                  {credits.map((credit) => {
                    return <Tab key={credit.id}>{credit.creditName}</Tab>;
                  })}
                </TabList>
              </Box>
              <Box>
                <ButtonGroup isAttached variant={"outline"}>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      router.push(`/update-credit/${credits[tabIndex].id}`);
                    }}
                  >
                    Ändern
                  </Button>
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
                <TabPanel key={credit.id}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box flex={1}>
                      {isLoadingCreditData ? (
                        <SkeletonText mt="4" noOfLines={6} spacing="4" />
                      ) : creditDataError ? (
                        <Alert status="error">
                          <AlertIcon />
                          {creditDataError}
                        </Alert>
                      ) : (
                        creditData && (
                          <CreditDetails {...creditData}></CreditDetails>
                        )
                      )}
                    </Box>
                    <Box
                      ml={10}
                      p={4}
                      boxShadow="md"
                      borderRadius="md"
                      bg="white"
                      display={creditDataError ? "none" : "flex"}
                      alignItems={"center"}
                    >
                      {isLoadingCreditData ? (
                        <Skeleton height="200px" width="200px" />
                      ) : (
                        creditData && (
                          <CreditChart {...creditData}></CreditChart>
                        )
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
