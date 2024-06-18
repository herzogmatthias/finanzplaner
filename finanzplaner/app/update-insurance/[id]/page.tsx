"use client";
import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Center, useToast } from "@chakra-ui/react";
import InsuranceForm, {
  InsuranceFormData,
} from "@/components/insuranceForm/insuranceForm.component";
import { SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";
import InsuranceService from "@/services/Insurance.service";
import withAuth from "@/middleware/withAuth.middleware";
import { FileService } from "@/services/File.service";

const Page = () => {
  const { id } = useParams();
  const toast = useToast();
  const [defaultValues, setDefaultValues] = useState<InsuranceFormData | null>(
    null
  );

  useEffect(() => {
    // Fetch the insurance data by ID and set as default values
    // Replace the following line with your fetch logic
    const fetchInsuranceData = async () => {
      // Mock data
      const insuranceService = InsuranceService.getInstance();
      const details = await insuranceService.fetchInsuranceDetails(id as any);
      let startdate = new Date(details.dateOpened);
      startdate.setDate(startdate.getDate() + 1);
      setDefaultValues({
        accountId: details.policyHolderId,
        insurance: details.description,
        startDate: startdate.toISOString().substring(0, 10),
        paymentRate: details.frequency,
        type: details.insuranceType,
        isPaused: details.insuranceState,
        files: [] as any[],
        ...details,
      });
    };

    fetchInsuranceData();
  }, []);

  const handleSubmit: SubmitHandler<InsuranceFormData> = async (data) => {
    try {
      const insuranceService = InsuranceService.getInstance();
      const fileService = FileService.getInstance();
      if (data.files) {
        await fileService.uploadFiles(id as any, data.files, "I");
      }

      await insuranceService.updateInsurance(id as any, data);
      toast({
        title: "Versicherung aktualisiert",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Fehler beim Aktualisieren der Versicherung",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!defaultValues) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" mb={6}>
        Versicherung aktualisieren
      </Heading>
      <InsuranceForm onSubmit={handleSubmit} defaultValues={defaultValues} />
    </Box>
  );
};

export default withAuth(Page);
