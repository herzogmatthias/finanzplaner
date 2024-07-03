"use client";
import React from "react";
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Flex,
} from "@chakra-ui/react";
import { IInsurance } from "@/models/IInsurance";

const InsuranceDetails = ({
  policyHolderId,
  insuranceCompany,
  name,
  frequency,
  paymentAmount,
  dateOpened,
  insuranceState,
  additionalInformation,
  nextPayment,
  insuranceType,
  paymentUnitCurrency,
}: IInsurance) => {
  const frequencyMap: { [key: string]: string } = {
    Monthly: "Monatlich",
    Yearly: "Jährlich",
    Quarterly: "Quartalsweise",
  };
  const translatedFrequency = frequencyMap[frequency] || frequency;
  console.log(additionalInformation);
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Allgemeine Daten
      </Text>
      <Table variant="simple" mb={4}>
        <Tbody>
          <Tr>
            <Td>Versicherungsgesellschaft</Td>
            <Td>{insuranceCompany}</Td>
          </Tr>
          <Tr>
            <Td>Versicherung</Td>
            <Td>{insuranceType}</Td>
          </Tr>
          <Tr>
            <Td>Verknüpfter Account</Td>
            <Td>{policyHolderId}</Td>
          </Tr>
          <Tr>
            <Td>Laufzeit</Td>
            <Td>{new Date(dateOpened).toLocaleDateString("de-DE")}</Td>
          </Tr>
          <Tr>
            <Td>Zahlungsrate</Td>
            <Td>{translatedFrequency}</Td>
          </Tr>
          <Tr>
            <Td>Pausiert</Td>
            <Td>{insuranceState ? "Ja" : "Nein"}</Td>
          </Tr>
          <Tr>
            <Td>Nächste Zahlung</Td>
            <Td>{nextPayment}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Zusatzinformationen
      </Text>
      <Table variant="simple" mb={4}>
        <Tbody>
          {additionalInformation
            ? additionalInformation.map((info, index) => (
                <Tr key={index}>
                  <Td>{info.description}</Td>
                  <Td>{info.value}</Td>
                </Tr>
              ))
            : null}
        </Tbody>
      </Table>
      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="xl" fontWeight="bold">
          Kosten
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: paymentUnitCurrency,
          }).format(paymentAmount)}
        </Text>
      </Flex>
    </Box>
  );
};

export default InsuranceDetails;
