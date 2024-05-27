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

const InsuranceDetails: React.FC<IInsurance> = ({
  iban,
  insuranceCompany,
  name,
  paymentrate,
  payment,
  startdate,
  isPaused,
  additionalInformation,
  nextPayment,
  files,
}) => {
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
            <Td>{name}</Td>
          </Tr>
          <Tr>
            <Td>IBAN</Td>
            <Td>{iban}</Td>
          </Tr>
          <Tr>
            <Td>Polizze</Td>
            <Td>{name}</Td>
          </Tr>
          <Tr>
            <Td>Laufzeit</Td>
            <Td>{startdate}</Td>
          </Tr>
          <Tr>
            <Td>Zahlungsrate</Td>
            <Td>{paymentrate}</Td>
          </Tr>
          <Tr>
            <Td>Pausiert</Td>
            <Td>{isPaused ? "Ja" : "Nein"}</Td>
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
          {additionalInformation.map((info, index) => (
            <Tr key={index}>
              <Td>{info.description}</Td>
              <Td>{info.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="xl" fontWeight="bold">
          Monatliche Kosten
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          € {payment.toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
};

export default InsuranceDetails;
