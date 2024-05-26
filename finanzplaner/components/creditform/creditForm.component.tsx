// components/CreditForm.tsx
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
  InputRightElement,
  useMultiStyleConfig,
  InputRightAddon,
  InputLeftAddon,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { MdOutlineAccountBalance } from "react-icons/md";

interface CreditFormProps {
  isChanged?: boolean;
}

interface FormValues {
  IBAN: string;
  creditAmount: string;
  duration: string;
  name: string;
  interest: string;
  extraCosts: string;
  document: FileList | null;
}

const CreditForm = ({ isChanged }: CreditFormProps) => {
  const { id } = useParams(); // Extract ID from URL
  const styles = useMultiStyleConfig("Button", { variant: "outline" });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: async () => {
      if (isChanged && id) {
        return fetchCreditData(id);
      } else {
        return {
          IBAN: "",
          creditAmount: "",
          duration: "",
          name: "",
          interest: "",
          extraCosts: "",
          document: null,
        };
      }
    },
  });
  const toast = useToast();

  // Mock function to simulate fetching data
  const fetchCreditData = async (creditId: string | string[]) => {
    // Here you would fetch from your API
    // Simulating fetched data:
    const fetchedData = {
      IBAN: "DE89 3704 0044 0532 0130 00",
      creditAmount: "5000",
      duration: "24",
      name: "John Doe",
      interest: "5",
      extraCosts: "100",
      document: null,
    };

    return fetchedData;
  };

  useEffect(() => {}, []);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Here you would handle file within 'data.document'
    if (isChanged && id) {
      // Call update API
      console.log("Updating credit", id, data);
    } else {
      // Call add API
      console.log("Adding new credit", data);
    }
  };

  return (
    <Box p={5} boxShadow={"md"} mx={20} mt={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} mx={20}>
          <FormControl isInvalid={!!errors.IBAN}>
            <FormLabel size={"sm"} htmlFor="IBAN">
              IBAN
            </FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="IBAN"
                type="text"
                {...register("IBAN", {
                  required: "IBAN ist verpflichtend",
                  pattern: {
                    value:
                      /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/,
                    message:
                      "IBAN sollte im Format DE12 1234 1234 1234 1234 sein", // Custom message for pattern
                  },
                })}
              />
              <InputLeftElement>
                <Icon as={MdOutlineAccountBalance}></Icon>
              </InputLeftElement>
            </InputGroup>

            {errors.IBAN && (
              <FormErrorMessage>{errors.IBAN.message}</FormErrorMessage>
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
                    message: "Kreditbetrag sollte mindestens 1€ betragen", // Custom message for min
                  },
                })}
              />
              <InputRightAddon>€</InputRightAddon>
            </InputGroup>
            {errors.creditAmount && (
              <FormErrorMessage>{errors.creditAmount.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.duration}>
            <FormLabel htmlFor="duration">Dauer</FormLabel>
            <InputGroup size={"sm"}>
              <Input
                size={"sm"}
                id="duration"
                type="number"
                {...register("duration", {
                  required: "Dauer ist verpflichtend",
                  min: {
                    value: 1,
                    message: "Dauer sollte mindestens 1 Jahr betragen", // Custom message for min
                  },
                  max: {
                    value: 99,
                    message: "Dauer sollte nicht über 99 Jahre liegen", // Custom message for max
                  },
                })}
              />
              <InputRightAddon>Jahre</InputRightAddon>
            </InputGroup>

            {errors.duration && (
              <FormErrorMessage>{errors.duration.message}</FormErrorMessage>
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
                type="text"
                {...register("interest", {
                  required: "Zinsen sind verpflichtend",
                  min: {
                    value: 0,
                    message: "Zinsen sollten nicht negativ sein", // Custom message for min
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
                type="text"
                {...register("extraCosts")}
              />
              <InputRightAddon>€</InputRightAddon>
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
