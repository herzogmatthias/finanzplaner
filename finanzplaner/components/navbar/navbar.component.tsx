"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  IconButton,
  Icon,
  MenuList,
  MenuItem,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { MdAccountCircle, MdMenu, MdClose } from "react-icons/md";
import { useApp } from "@/context/app.context";

const Navbar = () => {
  const router = useRouter();
  const isLoggedIn = Boolean(false);
  const app = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement your login logic here
    console.log("Login:", { username, password });
    // On successful login, set JWT and change isLoggedIn state accordingly
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.refresh();
  };

  const bgColor = useColorModeValue("blue.500", "blue.200");

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={3}
      bg={bgColor}
    >
      <Box display={"flex"} alignItems={"center"}>
        <IconButton
          aria-label="Open Menu"
          icon={<Icon size={"lg"} as={app?.isNavOpen ? MdClose : MdMenu} />}
          onClick={() => app?.toggleNav()}
          variant="solid"
          color={"white"}
          colorScheme="blue"
          marginRight={4}
          display={{ base: "flex" }} // Adjust visibility responsive
        />
        <Box
          color="white"
          fontWeight="bold"
          letterSpacing="wide"
          fontSize="xl"
          userSelect="none"
          cursor={"pointer"}
          onClick={() => router.push("/")}
        >
          Finanzplaner
        </Box>
      </Box>

      {isLoggedIn ? (
        <Flex align="center" marginTop={{ base: 4, md: 0 }}>
          <Button
            variant="solid"
            colorScheme="blue"
            marginRight="4"
            onClick={() => {
              /* logic to handle 'Kredit hinzufügen' action */
            }}
          >
            Kredit hinzufügen
          </Button>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => {
              /* logic to handle 'Konto verbinden' action */
            }}
          >
            Konto verbinden
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<Icon size="lg" as={MdAccountCircle} />}
              variant="solid"
              colorScheme="blue"
              marginLeft="4"
              size="lg"
            />
            <MenuList>
              <MenuItem onClick={() => router.push("/personal-page")}>
                Personal Page
              </MenuItem>
              <MenuItem color={"red.400"} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Flex align="center" marginTop={{ base: 4, md: 0 }}>
          <Menu isOpen={app?.isMenuOpen}>
            <MenuButton
              onClick={app?.toggleMenu}
              variant="solid"
              colorScheme="blue"
              as={Button}
            >
              Log In
            </MenuButton>
            <MenuList p={4}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" width="full">
                    Log In
                  </Button>
                </VStack>
              </form>
            </MenuList>
          </Menu>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => router.push("/sign-up")}
          >
            Sign Up
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
