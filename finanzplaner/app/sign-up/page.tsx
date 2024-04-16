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
} from "@chakra-ui/react";
import Image from "next/image";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Implement sign up logic here
    console.log("Sign Up:", { username, email, password, confirmPassword });
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
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl id="confirm-password" isRequired>
                <FormLabel>Passwort wiederholen</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
