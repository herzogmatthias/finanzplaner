// app/providers.tsx
"use client";

import { AppProvider } from "@/context/app.context";
import { FilterProvider } from "@/context/filter.context";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <FilterProvider>{children}</FilterProvider>
      </AppProvider>
    </ChakraProvider>
  );
}
