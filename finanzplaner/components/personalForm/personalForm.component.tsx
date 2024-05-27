// components/PersonalForm.tsx
"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Select,
  useToast,
  Heading,
  InputGroup,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface FormValues {
  email: string;
  username: string;
  currencyUnit: string;
}

const PersonalForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      username: "",
      currencyUnit: "EUR", // Default to Euros
    },
  });

  const toast = useToast();

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Here you would handle the form submission
    toast({
      title: "Profile Updated",
      description: "Your personal information has been successfully updated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={5} boxShadow={"md"} mx={20} mt={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} mx={20}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.currencyUnit}>
            <FormLabel htmlFor="currencyUnit">Currency Unit</FormLabel>
            <Select
              id="currencyUnit"
              {...register("currencyUnit", {
                required: "Currency unit is required",
              })}
            >
              <option value="EUR">Euros (EUR)</option>
              <option value="USD">US Dollars (USD)</option>
            </Select>
            {errors.currencyUnit && (
              <FormErrorMessage>{errors.currencyUnit.message}</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
        <Box mt={8} display={"flex"} justifyContent={"end"}>
          <Button colorScheme="teal" type="submit">
            Update Profile
          </Button>
          <Button ml={4} colorScheme="red" type="reset">
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PersonalForm;
