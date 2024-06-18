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
  useToast,
} from "@chakra-ui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IInsurance } from "@/models/IInsurance";
import InsuranceService from "@/services/Insurance.service";
import CostHistoryChart from "@/components/costHistoryChart/costHistoryChart.component";
import IntervalPaymentChart from "@/components/intervalPaymentChart/intervalPaymentChart.component";
import { useRouter } from "next/navigation";
import withAuth from "@/middleware/withAuth.middleware";
import { IDocument } from "@/models/IDocument";
import { FileService } from "@/services/File.service";
import InsuranceDetails from "@/components/insuranceDetails/insuranceDetails.compoent";

const InsuranceOverview = () => {
  const router = useRouter();
  const toast = useToast();
  const [insurances, setInsurances] = useState<
    { description: string; insuranceId: number }[]
  >([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [insuranceData, setInsuranceData] = useState<IInsurance | null>(null);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [isLoadingInsurances, setIsLoadingInsurances] = useState(true);
  const [isLoadingInsuranceData, setIsLoadingInsuranceData] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [insurancesError, setInsurancesError] = useState<string | null>(null);
  const [insuranceDataError, setInsuranceDataError] = useState<string | null>(
    null
  );
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    setIsLoadingInsurances(true);
    setInsurancesError(null);
    setTabIndex(0);
    try {
      const service = InsuranceService.getInstance();
      const fetchedInsurances = await service.fetchInsurances();
      setInsurances(fetchedInsurances);
      if (fetchedInsurances.length > 0) {
        fetchInsuranceDetails(fetchedInsurances[0].insuranceId);
        fetchDocuments(fetchedInsurances[0].insuranceId);
      }
    } catch (err) {
      setInsurancesError("Fehler beim laden der Versicherungen");
    } finally {
      setIsLoadingInsurances(false);
    }
  };

  const fetchInsuranceDetails = async (id: number) => {
    setIsLoadingInsuranceData(true);
    setInsuranceDataError(null);
    try {
      const service = InsuranceService.getInstance();
      const fetchedInsuranceData = await service.fetchInsuranceDetails(id);
      setInsuranceData(fetchedInsuranceData);
    } catch (err) {
      setInsuranceDataError("Fehler beim laden der Details");
    } finally {
      setIsLoadingInsuranceData(false);
    }
  };

  const fetchDocuments = async (id: number) => {
    setDocuments([]);
    setIsLoadingDocuments(true);
    setDocumentsError(null);
    try {
      const service = FileService.getInstance();
      const fetchedDocuments = await service.fetchFiles(id.toString(), "I");
      setDocuments(fetchedDocuments);
    } catch (err) {
      setDocumentsError("Fehler beim laden der Dokumente");
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    fetchInsuranceDetails(insurances[index].insuranceId);
    fetchDocuments(insurances[index].insuranceId);
  };

  const handleDelete = async (document: IDocument) => {
    try {
      const service = FileService.getInstance();
      await service.deleteFile(
        insurances[tabIndex].insuranceId as any,
        document.fileName
      );
      fetchDocuments(insurances[tabIndex].insuranceId); // Refresh documents list
      toast({
        title: `Datei gelöscht: ${document.fileName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Fehler beim Löschen der Datei",
        description: err as string,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const downloadDocument = async (document: IDocument) => {
    try {
      const service = FileService.getInstance();
      await service.downloadFile(
        document.fileID!.toString(),
        document.fileName
      );
      toast({
        title: "Dokument heruntergeladen.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fehler beim Herunterladen des Dokuments.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteInsurance = async () => {
    try {
      const service = InsuranceService.getInstance();
      const msg = await service.deleteInsurance(
        insurances[tabIndex].insuranceId
      );
      fetchInsurances();
      toast({
        title: "Versicherung erfolgreich gelöscht.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fehler beim Löschen der Versicherung.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
                <TabList overflow={"hidden"} width={"80%"}>
                  {insurances.map((insurance) => (
                    <Tab key={insurance.insuranceId}>
                      {insurance.description}
                    </Tab>
                  ))}
                </TabList>
              </Box>
              <Box>
                <ButtonGroup isAttached variant={"outline"}>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      router.push(
                        `/update-insurance/${insurances[tabIndex].insuranceId}`
                      );
                    }}
                  >
                    Ändern
                  </Button>
                  <Button onClick={deleteInsurance} colorScheme="blue">
                    Löschen
                  </Button>
                  <Menu>
                    <MenuButton
                      colorScheme="blue"
                      as={Button}
                      rightIcon={
                        <Icon size={"lg"} as={MdOutlineKeyboardArrowDown} />
                      }
                    >
                      Dokumente ({documents.length || 0})
                    </MenuButton>
                    <MenuList>
                      {documents.length > 0 ? (
                        documents.map((document, index) => (
                          <MenuItem
                            key={index}
                            cursor={"default"}
                            disabled={true}
                            closeOnSelect={false}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <span>{document.fileName}</span>
                            <span>
                              <Button
                                onClick={() => downloadDocument(document)}
                                ml={4}
                                colorScheme="blue"
                                size="xs"
                              >
                                Download
                              </Button>
                              <Button
                                ml={2}
                                colorScheme="red"
                                size="xs"
                                onClick={() => handleDelete(document)}
                              >
                                Löschen
                              </Button>
                            </span>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem>Keine Dokumente verfügbar</MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </ButtonGroup>
              </Box>
            </Box>

            <TabPanels>
              {insurances.map((insurance) => (
                <TabPanel key={insurance.description}>
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

export default withAuth(InsuranceOverview);
