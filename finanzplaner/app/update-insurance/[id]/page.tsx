"use client";
import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Center } from "@chakra-ui/react";
import InsuranceForm, {
  InsuranceFormData,
} from "@/components/insuranceForm/insuranceForm.component";
import { SubmitHandler } from "react-hook-form";

interface UpdateInsuranceProps {
  insuranceId: string;
}

const Page = ({ insuranceId }: UpdateInsuranceProps) => {
  const [defaultValues, setDefaultValues] = useState<InsuranceFormData | null>(
    null
  );

  useEffect(() => {
    // Fetch the insurance data by ID and set as default values
    // Replace the following line with your fetch logic
    const fetchInsuranceData = async () => {
      // Mock data
      const mockData: InsuranceFormData = {
        iban: "DE89 3704 0044 0532 0130 00",
        insuranceCompany: "Mock Insurance Company",
        insurance: "Mock Insurance",
        name: "Max Mustermann",
        policyNumber: "1234567890",
        startDate: "2023-01-01",
        paymentRate: "monthly",
        additionalInformation: [
          { description: "Extra Coverage", value: "5000" },
          { description: "Roadside Assistance", value: "Included" },
        ],
        files: new DataTransfer().files,
      };

      setDefaultValues(mockData);
    };

    fetchInsuranceData();
  }, [insuranceId]);

  const handleSubmit: SubmitHandler<InsuranceFormData> = (data) => {
    console.log(data);
    // Here you can handle the form submission, e.g., send it to an API
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

export default Page;
