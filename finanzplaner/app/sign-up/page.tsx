"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { UserService } from "@/services/User.service";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({} as any);
  const toast = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignUp = async () => {
    const newErrors: any = {};

    if (!username) {
      newErrors.username = "Username ist erforderlich";
    }
    if (!email) {
      newErrors.email = "Email ist erforderlich";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalide Email";
    }
    if (!password) {
      newErrors.password = "Passwort ist erforderlich";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Passwort wiederholen ist erforderlich";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const userService = UserService.getInstance();
      let error = await userService.register(email, username, password);
      console.log("Sign Up:", { username, email, password, confirmPassword });
      if (error !== "") {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Registrierung erfolgreich",
          description: "Du kannst dich jetzt einloggen",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={{ base: "5" }} px={{ base: "6", md: "8" }}>
      <VStack spacing="2">
        <Box boxSize="auto">
          {/* Replace the src with your original image path */}
          <Image
            src={"/logo_finance_planer_cropped.png"}
            width={300}
            height={300}
            alt="Logo"
          />
        </Box>
        <Heading as="h2" size="lg" textAlign="center">
          Erstelle einen Account
        </Heading>
        <Box w="full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            <VStack spacing="5">
              <FormControl
                id="username"
                isRequired
                isInvalid={!!errors.username}
              >
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>
              <FormControl id="email" isRequired isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={!!errors.password}
              >
                <FormLabel>Passwort</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="confirm-password"
                isRequired
                isInvalid={!!errors.confirmPassword}
              >
                <FormLabel>Passwort wiederholen</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                Account erstellen
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default SignUp;
