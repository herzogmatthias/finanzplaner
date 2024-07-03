"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Icon,
  useColorModeValue,
  Heading,
  Divider,
  IconButton,
  Button,
} from "@chakra-ui/react";
import {
  MdOutlineAccountBalance,
  MdOutlineRefresh,
  MdOutlineRealEstateAgent,
  MdOutlinePolicy,
  MdOutlineCalculate,
} from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/app.context";

const SideNav = () => {
  const textColor = useColorModeValue("gray.600", "white");
  const router = useRouter();
  const pathname = usePathname();
  const app = useApp();
  const [activeItem, setActiveItem] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const activeBg = useColorModeValue("blue.500", "blue.200"); // active item background color
  const activeHoverBg = useColorModeValue("blue.600", "blue.300"); // active item hover background color

  //listen to route change and set active item
  useEffect(() => {
    console.log(pathname);
    if (
      sections.some((section) =>
        section.items.some((item) => item.route === pathname)
      )
    ) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setActiveItem(pathname);
  }, [pathname]);

  const changeRoute = (route: string) => {
    setActiveItem(route);
    router.push(route);
  };

  // Section headers
  const sections = [
    {
      title: "Analysen",
      items: [
        { icon: MdOutlineAccountBalance, label: "Konten", route: "/accounts" },
        {
          icon: MdOutlineRefresh,
          label: "Daueraufträge",
          route: "/saving-plans",
        },
        {
          icon: MdOutlineRealEstateAgent,
          label: "Kredite",
          route: "/credit-overview",
        },
        {
          icon: MdOutlinePolicy,
          label: "Versicherungen",
          route: "/insurance-overview",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          icon: MdOutlineCalculate,
          label: "Kreditsimulator",
          route: "/credit-simulator",
        },
      ],
    },
  ];

  return (
    <Box
      w={app?.isNavOpen ? "200px" : "50px"}
      transition="0.2s ease"
      h="100vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      visibility={{ base: isVisible ? "visible" : "hidden" }}
      display={{ base: "block" }}
    >
      <Flex
        flexDirection="column"
        justifyContent="start"
        alignItems={"center"}
        h="100%"
        p={"2"}
      >
        {sections.map((section, index) => (
          <VStack
            align={app?.isNavOpen ? "start" : "center"}
            spacing="2"
            px={"4"}
            key={index}
            py="2"
          >
            {app?.isNavOpen && (
              <Heading as="h4" size="sm" color={textColor} mx="2">
                {section.title}
              </Heading>
            )}
            {section.items.map((item, itemIndex) => {
              const isActive = item.route === activeItem;
              return (
                <Flex key={itemIndex} align="center" role="group">
                  {app?.isNavOpen ? (
                    <Button
                      flex={1}
                      justifyContent="start"
                      leftIcon={<Icon as={item.icon} />}
                      colorScheme="black"
                      variant={isActive ? "solid" : "ghost"}
                      bg={isActive ? activeBg : "transparent"}
                      _hover={{
                        bg: isActive ? activeHoverBg : "blue.100", // hover state if needed
                      }}
                      onClick={() => changeRoute(item.route)}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <IconButton
                      colorScheme="black"
                      variant={isActive ? "solid" : "ghost"}
                      aria-label={item.label}
                      size={"md"}
                      icon={<Icon size="lg" as={item.icon} />}
                      bg={isActive ? activeBg : "transparent"}
                      _hover={{
                        bg: isActive ? activeHoverBg : "blue.100", // hover state if needed
                      }}
                      onClick={() => {
                        changeRoute(item.route);
                      }}
                    />
                  )}
                </Flex>
              );
            })}
            {index < sections.length - 1 && !app?.isNavOpen && (
              <Divider borderColor={"black"} borderBottomWidth={"3px"} />
            )}
          </VStack>
        ))}
      </Flex>
    </Box>
  );
};

export default SideNav;
