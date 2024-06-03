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
      newErrors.username = "Username is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
          title: "Registration failed",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "You have successfully registered",
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
                <FormLabel>Password</FormLabel>
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
