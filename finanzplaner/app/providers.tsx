// app/providers.tsx
"use client";

import { AppProvider } from "@/context/app.context";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AppProvider>{children}</AppProvider>
    </ChakraProvider>
  );
}
