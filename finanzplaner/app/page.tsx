"use client";
import React from "react";
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useApp } from "@/context/app.context";

export default function Home() {
  const router = useRouter();
  const app = useApp();
  return (
    <Box
      as="section"
      pt={{ base: "120px", md: "75px" }}
      pb={{ base: "0", md: "75px" }}
      px={{ base: "5%", md: "10%" }}
    >
      <VStack spacing={0} alignItems="center">
        <Box boxSize="auto">
          {/* Replace the src with your original image path */}
          <Image
            src="/logo_finance_planer_cropped.png"
            alt="Finanzplaner Image"
            width={400}
            height={324}
          />
        </Box>

        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Willkommen bei Finanzplaner – Ihr Wegweiser zu finanzieller Klarheit
          </Text>
          <Button
            onClick={() => router.push("/sign-up")}
            colorScheme="blue"
            size="lg"
            width="200px"
          >
            Registrieren
          </Button>
          <Text>oder</Text>
          <Button
            variant="outline"
            colorScheme="blue"
            size="lg"
            width="200px"
            onClick={app?.toggleMenu}
          >
            Log In
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
