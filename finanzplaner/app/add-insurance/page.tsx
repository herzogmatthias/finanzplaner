"use client";
import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import InsuranceForm, {
  InsuranceFormData,
} from "@/components/insuranceForm/insuranceForm.component";
import { SubmitHandler } from "react-hook-form";

const Page = () => {
  const handleSubmit: SubmitHandler<InsuranceFormData> = (data) => {
    console.log(data);
    // Here you can handle the form submission, e.g., send it to an API
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
