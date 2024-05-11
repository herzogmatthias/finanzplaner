// pages/index.tsx or pages/[id].tsx
"use client";
import CreditForm from "@/components/creditform/creditForm.component";
import { Box, Heading } from "@chakra-ui/react";

const UpdateCreditPage = () => {
  return (
    <Box>
      <Heading mt={8} ml={8}>
        Kredit anpassen
      </Heading>
      <CreditForm isChanged={true} />
    </Box>
  );
};

export default UpdateCreditPage;
