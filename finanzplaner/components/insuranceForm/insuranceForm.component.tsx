"use client";
import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Radio,
  RadioGroup,
  IconButton,
  SimpleGrid,
  FormErrorMessage,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { MdAdd, MdRemove } from "react-icons/md";

interface AdditionalInfo {
  description: string;
  value: string;
}

export interface InsuranceFormData {
  accountId: string;
  insuranceCompany: string;
  insurance: string;
  startDate: string;
  paymentRate: string;
  type: string;
  paymentAmount: number;
  additionalInformation: AdditionalInfo[];
  paymentInstalmentAmount: number;
  paymentInstalmentUnitCurrency: string;
  country: string;
  paymentUnitCurrency: string;
  isPaused: boolean;
  files: any | null;
}

interface InsuranceFormProps {
  onSubmit: SubmitHandler<InsuranceFormData>;
  defaultValues?: InsuranceFormData;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<InsuranceFormData>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalInformation",
  });

  const paymentRate = watch("paymentRate");
  console.log(defaultValues);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={5}
      boxShadow={"md"}
      mx={20}
      mt={4}
    >
      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <FormControl isRequired>
            <FormLabel>Account ID</FormLabel>
            <Input
              {...register("accountId", {
                required: "Account ID ist verpflichtend",
              })}
            />
            {errors.accountId && (
              <FormErrorMessage>{errors.accountId.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Versicherungsgesellschaft</FormLabel>
            <Input
              {...register("insuranceCompany", {
                required: "Versicherungsgesellschaft ist verpflichtend",
              })}
            />
            {errors.insuranceCompany && (
              <FormErrorMessage>
                {errors.insuranceCompany.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Versicherung</FormLabel>
            <Input
              {...register("insurance", {
                required: "Versicherung ist verpflichtend",
              })}
            />
            {errors.insurance && (
              <FormErrorMessage>{errors.insurance.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Laufzeit Beginn</FormLabel>
            <Input
              type="date"
              {...register("startDate", {
                required: "Laufzeit Beginn ist verpflichtend",
              })}
            />
            {errors.startDate && (
              <FormErrorMessage>{errors.startDate.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Zahlungsrate</FormLabel>
            <RadioGroup defaultValue={paymentRate}>
              <Stack spacing={5} direction="row">
                <Radio {...register("paymentRate")} value="Monthly">
                  monatlich
                </Radio>
                <Radio {...register("paymentRate")} value="Quarterly">
                  quartalsweise
                </Radio>
                <Radio {...register("paymentRate")} value="Yearly">
                  jährlich
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Typ</FormLabel>
            <Input
              {...register("type", { required: "Typ ist verpflichtend" })}
            />
            {errors.type && (
              <FormErrorMessage>{errors.type.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Zahlungsbetrag</FormLabel>
            <InputGroup>
              <Input
                type="number"
                step="0.01"
                {...register("paymentAmount", {
                  required: "Zahlungsbetrag ist verpflichtend",
                  min: {
                    value: 0,
                    message: "Zahlungsbetrag darf nicht negativ sein",
                  },
                })}
              />
              <InputRightAddon>
                {typeof window !== "undefined"
                  ? localStorage.getItem("currency") === "USD"
                    ? "$"
                    : "€"
                  : null}
              </InputRightAddon>
            </InputGroup>
            {errors.paymentAmount && (
              <FormErrorMessage>
                {errors.paymentAmount.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Datei Upload</FormLabel>
            <Input type="file" {...register("files")} />
          </FormControl>
        </Box>

        <Box>
          <FormControl mt={4}>
            <FormLabel>Zusatzinformationen</FormLabel>
            {fields.map((item, index) => (
              <Stack key={item.id} direction="row" alignItems="center" mb={2}>
                <Input
                  placeholder="Beschreibung"
                  {...register(
                    `additionalInformation.${index}.description` as const
                  )}
                />
                <Input
                  placeholder="Leistung"
                  {...register(`additionalInformation.${index}.value` as const)}
                />
                <IconButton
                  icon={<MdRemove />}
                  onClick={() => remove(index)}
                  aria-label="Remove item"
                />
              </Stack>
            ))}
            <Button
              leftIcon={<MdAdd />}
              mt={2}
              size={"sm"}
              onClick={() => append({ description: "", value: "" })}
            >
              Leistung
            </Button>
          </FormControl>
        </Box>
      </SimpleGrid>

      <Box mt={6} display={"flex"} justifyContent={"end"}>
        <Button mt={4} colorScheme="blue" type="submit">
          Speichern
        </Button>
        <Button mt={4} ml={4} onClick={() => reset()} variant="outline">
          Abbrechen
        </Button>
      </Box>
    </Box>
  );
};

export default InsuranceForm;
