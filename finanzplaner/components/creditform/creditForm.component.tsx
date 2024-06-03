"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  useToast,
  InputGroup,
  InputRightAddon,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { MdOutlineAccountBalance } from "react-icons/md";
import CreditService from "@/services/Credit.service";

interface CreditFormProps {
  isChanged?: boolean;
}

export interface FormValues {
  accountID: string;
  creditAmount: number;
  startDate: string;
  endDate: string;
  name: string;
  interest: number;
  extraCosts: number;
  frequency: string;
  loanStatus: string;
  document: FileList | null;
}

const CreditForm = ({ isChanged }: CreditFormProps) => {
  const { id } = useParams(); // Extract ID from URL
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: async () => {
      if (isChanged && id) {
        return await fetchCreditData(id);
      } else {
        return {
          accountID: "",
          creditAmount: 0,
          startDate: "",
          endDate: "",
          name: "",
          interest: 0,
          extraCosts: 0,
          frequency: "Monthly",
          loanStatus: "Active",
          document: null,
        };
      }
    },
  });
  const toast = useToast();

  // Fetch credit data
  const fetchCreditData = async (creditId: string | string[]) => {
    const creditService = CreditService.getInstance();
    const fetchedData = await creditService.fetchCreditDetails(creditId as any);
    let startDate = new Date(fetchedData.startDate);
    let endDate = new Date(fetchedData.endDate);
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);

    return {
      accountID: fetchedData.creditorAccountId,
      creditAmount: fetchedData.loanAmount,
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
      name: fetchedData.loanName,
      interest: fetchedData.interestRate,
      extraCosts: fetchedData.additionalCosts,
      frequency: fetchedData.frequency,
      loanStatus: fetchedData.loanStatus,
      document: null,
    };
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const creditService = CreditService.getInstance();
      if (isChanged && id) {
        await creditService.updateCredit(id as any, data);
        toast({
          title: "Kreditdetails aktualisiert.",
          description: "Die Kreditdetails wurden erfolgreich aktualisiert.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await creditService.addCredit(data);
        toast({
          title: "Kredit hinzugefügt.",
          description: "Der Kredit wurde erfolgreich hinzugefügt.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description:
          "Kredit konnte nicht hinzugefügt oder geändert werden. Bitte versuchen Sie es erneut.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} boxShadow={"md"} mx={20} mt={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} mx={20}>
          <FormControl isInvalid={!!errors.accountID}>
            <FormLabel size={"sm"} htmlFor="accountID">
              Account ID
            </FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="accountID"
                type="text"
                {...register("accountID", {
                  required: "Account ID ist verpflichtend",
                })}
              />
              <InputLeftElement>
                <Icon as={MdOutlineAccountBalance}></Icon>
              </InputLeftElement>
            </InputGroup>
            {errors.accountID && (
              <FormErrorMessage>{errors.accountID.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.creditAmount}>
            <FormLabel htmlFor="creditAmount">Kreditbetrag</FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="creditAmount"
                type="number"
                {...register("creditAmount", {
                  required: "Kreditbetrag ist verpflichtend",
                  min: {
                    value: 1,
                    message: "Kreditbetrag sollte mindestens 1€ betragen",
                  },
                })}
              />
              <InputRightAddon>
                {localStorage.getItem("currency") == "EUR" ? "€" : "$"}
              </InputRightAddon>
            </InputGroup>
            {errors.creditAmount && (
              <FormErrorMessage>{errors.creditAmount.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.startDate}>
            <FormLabel htmlFor="startDate">Startdatum</FormLabel>
            <Input
              size={"sm"}
              id="startDate"
              type="date"
              {...register("startDate", {
                required: "Startdatum ist verpflichtend",
              })}
            />
            {errors.startDate && (
              <FormErrorMessage>{errors.startDate.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.endDate}>
            <FormLabel htmlFor="endDate">Enddatum</FormLabel>
            <Input
              size={"sm"}
              id="endDate"
              type="date"
              {...register("endDate", {
                required: "Enddatum ist verpflichtend",
              })}
            />
            {errors.endDate && (
              <FormErrorMessage>{errors.endDate.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Kreditname</FormLabel>
            <Input
              size={"sm"}
              id="name"
              type="text"
              {...register("name", {
                required: "Kreditname ist verpflichtend",
              })}
            />
            {errors.name && (
              <FormErrorMessage>{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.interest}>
            <FormLabel htmlFor="interest">Zinsen</FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="interest"
                type="number"
                step="0.01"
                {...register("interest", {
                  required: "Zinsen sind verpflichtend",
                  min: {
                    value: 0,
                    message: "Zinsen sollten nicht negativ sein",
                  },
                })}
              />
              <InputRightAddon>%</InputRightAddon>
            </InputGroup>
            {errors.interest && (
              <FormErrorMessage>{errors.interest.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.extraCosts}>
            <FormLabel htmlFor="extraCosts">Zusatzkosten p.a.</FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="extraCosts"
                type="number"
                step="0.01"
                {...register("extraCosts")}
              />
              <InputRightAddon>
                {localStorage.getItem("currency") == "EUR" ? "€" : "$"}
              </InputRightAddon>
            </InputGroup>
            {errors.extraCosts && (
              <FormErrorMessage>{errors.extraCosts.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.document}>
            <FormLabel htmlFor="document">Dokumente</FormLabel>
            <Input
              size={"sm"}
              type="file"
              multiple
              w="100%"
              p={2}
              borderWidth="1px"
              css={{
                "&::file-selector-button": {
                  alignItems: "center",
                  textAlign: "center",
                  display: "none",
                  backgroundColor: "blue.400",
                  _hover: {
                    backgroundColor: "blue.500",
                  },
                  _active: {
                    backgroundColor: "blue.600",
                  },
                },
              }}
              id="document"
              {...register("document")}
            />
            {errors.document && (
              <FormErrorMessage>{errors.document.message}</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
        <Box mt={8} display={"flex"} justifyContent={"end"}>
          <Button colorScheme="blue" type="submit">
            {isChanged ? "Kredit Ändern" : "Kredit hinzufügen"}
          </Button>
          <Button ml={4} mr={2} variant={"outline"} type="reset">
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreditForm;
