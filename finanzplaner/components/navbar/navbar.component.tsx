"use client";
import React, { use, useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { MdAccountCircle, MdMenu, MdClose } from "react-icons/md";
import { useApp } from "@/context/app.context";
import { UserService } from "@/services/User.service";

const Navbar = () => {
  const router = useRouter();
  const userService = UserService.getInstance();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const app = useApp();
  const toast = useToast();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // TODO: Implement your login logic here
    const msg = await userService.login(username, password);
    toast({
      title: msg.msg,
      status: msg.error ? "error" : "success",
      duration: 5000,
      isClosable: true,
    });
    if (!msg.error) {
      setIsLoggedIn(true);
    }
  };
  const handleLogout = () => {
    userService.deleteJWT();
    setIsLoggedIn(false);
    router.push("/");
  };

  useEffect(() => {
    //setIsLoggedIn(userService.getJWT() !== "");
  }, []);

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
          display={{ base: isLoggedIn && pathname !== "/" ? "flex" : "none" }} // Adjust visibility responsive
        />
        <Box
          color="white"
          fontWeight="bold"
          letterSpacing="wide"
          fontSize="xl"
          userSelect="none"
          cursor={"pointer"}
          onClick={() => {
            if (isLoggedIn) {
              router.push("/accounts");
            } else {
              router.push("/");
            }
          }}
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
