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
} from "@chakra-ui/react";
import { MdAdd, MdRemove } from "react-icons/md";

interface AdditionalInfo {
  description: string;
  value: string;
}

export interface InsuranceFormData {
  iban: string;
  insuranceCompany: string;
  insurance: string;
  name: string;
  policyNumber: string;
  startDate: string;
  paymentRate: string;
  additionalInformation: AdditionalInfo[];
  files: FileList;
}

interface InsuranceFormProps {
  onSubmit: SubmitHandler<InsuranceFormData>;
  defaultValues?: InsuranceFormData;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const { register, handleSubmit, control, reset, watch } =
    useForm<InsuranceFormData>({
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalInformation",
  });

  const paymentRate = watch("paymentRate");

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
            <FormLabel>IBAN</FormLabel>
            <Input {...register("iban")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Versicherungsgesellschaft</FormLabel>
            <Input {...register("insuranceCompany")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Versicherung</FormLabel>
            <Input {...register("insurance")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Name</FormLabel>
            <Input {...register("name")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Polizzennummer</FormLabel>
            <Input {...register("policyNumber")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Laufzeit Beginn</FormLabel>
            <Input type="date" {...register("startDate")} />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Zahlungsrate</FormLabel>
            <RadioGroup defaultValue={paymentRate}>
              <Stack spacing={5} direction="row">
                <Radio {...register("paymentRate")} value="monthly">
                  monatlich
                </Radio>
                <Radio {...register("paymentRate")} value="quarterly">
                  quartalsweise
                </Radio>
                <Radio {...register("paymentRate")} value="yearly">
                  jährlich
                </Radio>
              </Stack>
            </RadioGroup>
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
