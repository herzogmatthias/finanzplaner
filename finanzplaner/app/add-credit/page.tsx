// pages/index.tsx or pages/[id].tsx
"use client";
import CreditForm from "@/components/creditform/creditForm.component";
import { Box, Heading } from "@chakra-ui/react";

const AddCreditPage = () => {
  return (
    <Box>
      <Heading mt={8} ml={8}>
        Kredit hinzufügen
      </Heading>
      <CreditForm isChanged={false} />
    </Box>
  );
};

export default AddCreditPage;
