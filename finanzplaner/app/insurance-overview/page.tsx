"use client";
import React, { useEffect, useState } from "react";
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
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IInsurance } from "@/models/IInsurance";
import InsuranceService from "@/services/Insurance.service";
import InsuranceDetails from "@/components/insuranceDetails/insuranceDetails.compoent";
import CostHistoryChart from "@/components/costHistoryChart/costHistoryChart.component";
import IntervalPaymentChart from "@/components/intervalPaymentChart/intervalPaymentChart.component";
import { useRouter } from "next/navigation";

const InsuranceOverview = () => {
  const router = useRouter();
  const [insurances, setInsurances] = useState<
    { insuranceName: string; id: number }[]
  >([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [insuranceData, setInsuranceData] = useState<IInsurance | null>(null);
  const [isLoadingInsurances, setIsLoadingInsurances] = useState(true);
  const [isLoadingInsuranceData, setIsLoadingInsuranceData] = useState(false);
  const [insurancesError, setInsurancesError] = useState<string | null>(null);
  const [insuranceDataError, setInsuranceDataError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchInsurances = async () => {
      setIsLoadingInsurances(true);
      setInsurancesError(null);
      try {
        const service = InsuranceService.getInstance();
        const fetchedInsurances = await service.fetchInsurances();
        setInsurances(fetchedInsurances);
        if (fetchedInsurances.length > 0) {
          fetchInsuranceDetails(fetchedInsurances[0].id);
        }
      } catch (err) {
        setInsurancesError("Error fetching insurances.");
      } finally {
        setIsLoadingInsurances(false);
      }
    };

    fetchInsurances();
  }, []);

  const fetchInsuranceDetails = async (id: number) => {
    setIsLoadingInsuranceData(true);
    setInsuranceDataError(null);
    try {
      const service = InsuranceService.getInstance();
      const fetchedInsuranceData = await service.fetchInsuranceDetails(id);
      setInsuranceData(fetchedInsuranceData);
    } catch (err) {
      setInsuranceDataError("Error fetching insurance details.");
    } finally {
      setIsLoadingInsuranceData(false);
    }
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    fetchInsuranceDetails(insurances[index].id);
  };

  if (isLoadingInsurances) {
    return (
      <Box mt={8} ml={8}>
        <Skeleton height="40px" width="200px" mb={4} />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    );
  }

  if (insurancesError) {
    return (
      <Box mt={8} ml={8}>
        <Alert status="error">
          <AlertIcon />
          {insurancesError}
        </Alert>
      </Box>
    );
  }

  if (insurances.length === 0) {
    return (
      <Box mt={8} ml={8}>
        <Heading as="h2" size={"lg"}>
          Keine Versicherungen verfügbar
        </Heading>
      </Box>
    );
  }

  return (
    <Box mt={8} ml={8}>
      <Heading as="h2" size={"lg"}>
        Versicherungen
      </Heading>

      <Box display="flex">
        <Box flex="1" mr={4}>
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mr={4}
            >
              <Box flex={1}>
                <TabList width={"80%"}>
                  {insurances.map((insurance) => {
                    return (
                      <Tab key={insurance.id}>{insurance.insuranceName}</Tab>
                    );
                  })}
                </TabList>
              </Box>
              <Box>
                <ButtonGroup isAttached variant={"outline"}>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      router.push(
                        `/update-insurance/${insurances[tabIndex].id}`
                      );
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
                      Dokumente ({insuranceData?.files.length || 0})
                    </MenuButton>
                    <MenuList>
                      {insuranceData?.files.map((document, index) => (
                        <MenuItem key={index}>{document}</MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </ButtonGroup>
              </Box>
            </Box>

            <TabPanels>
              {insurances.map((insurance) => (
                <TabPanel key={insurance.id}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box flex={1}>
                      {isLoadingInsuranceData ? (
                        <SkeletonText mt="4" noOfLines={6} spacing="4" />
                      ) : insuranceDataError ? (
                        <Alert status="error">
                          <AlertIcon />
                          {insuranceDataError}
                        </Alert>
                      ) : (
                        insuranceData && (
                          <InsuranceDetails
                            {...insuranceData}
                          ></InsuranceDetails>
                        )
                      )}
                    </Box>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
        <Box mr={4}>
          <Box boxShadow={"md"} mb={4} p={4}>
            <IntervalPaymentChart />
          </Box>
          <Box boxShadow={"md"} mt={4} p={4}>
            <CostHistoryChart />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InsuranceOverview;