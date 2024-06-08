"use client";
import React from "react";
import { Box, Heading, useToast } from "@chakra-ui/react";
import InsuranceForm, {
  InsuranceFormData,
} from "@/components/insuranceForm/insuranceForm.component";
import { SubmitHandler } from "react-hook-form";
import InsuranceService from "@/services/Insurance.service";

const Page = () => {
  const toast = useToast();
  const handleSubmit: SubmitHandler<InsuranceFormData> = async (data) => {
    try {
      const insuranceService = InsuranceService.getInstance();
      await insuranceService.addInsurance(data);
      toast({
        title: "Versicherung hinzugefügt!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Fehler beim Hinzufügen der Versicherung",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={6}>
        Neue Versicherung anlegen
      </Heading>
      <InsuranceForm onSubmit={handleSubmit} />
    </Box>
  );
};

export default Page;
