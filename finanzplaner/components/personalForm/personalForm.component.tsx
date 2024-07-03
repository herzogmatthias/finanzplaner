// components/PersonalForm.tsx
"use client";
import { UserService } from "@/services/User.service";
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
      currencyUnit:
        typeof window !== "undefined"
          ? localStorage.getItem("currency") || "EUR"
          : "EUR", // Default to Euros
    },
  });

  const toast = useToast();

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const userService = UserService.getInstance();
      const result = await userService.updatePersonalData(
        data.email,
        data.username,
        data.currencyUnit
      );
      toast({
        title: "Profil erfolgreich aktualisiert.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Fehler beim Aktualisieren des Profils.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} boxShadow={"md"} mt={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} mx={20}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              {...register("email", {
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
            <FormLabel htmlFor="username">Benutzername</FormLabel>
            <Input id="username" type="text" {...register("username")} />
            {errors.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.currencyUnit}>
            <FormLabel htmlFor="currencyUnit">Währungseinheit</FormLabel>
            <Select id="currencyUnit" {...register("currencyUnit")}>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US Dollar (USD)</option>
            </Select>
            {errors.currencyUnit && (
              <FormErrorMessage>{errors.currencyUnit.message}</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
        <Box mt={8} display={"flex"} justifyContent={"end"}>
          <Button colorScheme="blue" type="submit">
            Profil ändern
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
