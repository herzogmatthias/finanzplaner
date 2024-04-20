"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  useDisclosure,
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

const SideNav = () => {
  const { isOpen, onToggle } = useDisclosure();
  const textColor = useColorModeValue("gray.600", "white");
  const [activeItem, setActiveItem] = useState("");
  const activeBg = useColorModeValue("blue.500", "blue.200"); // active item background color
  const activeHoverBg = useColorModeValue("blue.600", "blue.300"); // active item hover background color

  // Section headers
  const sections = [
    {
      title: "Analysen",
      items: [
        { icon: MdOutlineAccountBalance, label: "Konten" },
        { icon: MdOutlineRefresh, label: "Sparpläne" },
        { icon: MdOutlineRealEstateAgent, label: "Kredite" },
        { icon: MdOutlinePolicy, label: "Versicherungen" },
      ],
    },
    {
      title: "Tools",
      items: [{ icon: MdOutlineCalculate, label: "Kreditsimulator" }],
    },
  ];

  return (
    <Box
      w={isOpen ? "200px" : "50px"}
      transition="0.2s ease"
      h="100vh"
      onMouseEnter={onToggle}
      onMouseLeave={onToggle}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
    >
      <Flex
        flexDirection="column"
        justifyContent="start"
        alignItems={"center"}
        h="100%"
        p={isOpen ? "2" : "2"}
      >
        {sections.map((section, index) => (
          <VStack
            align={isOpen ? "start" : "center"}
            spacing="2"
            px={"4"}
            key={index}
            py="2"
          >
            {isOpen && (
              <Heading as="h4" size="sm" color={textColor} mx="2">
                {section.title}
              </Heading>
            )}
            {section.items.map((item, itemIndex) => {
              const isActive = item.label === activeItem;
              return (
                <Flex key={itemIndex} align="center" role="group">
                  {isOpen ? (
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
                      onClick={() => setActiveItem(item.label)}
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
                      onClick={() => setActiveItem(item.label)}
                    />
                  )}
                </Flex>
              );
            })}
            {index < sections.length - 1 && !isOpen && (
              <Divider borderColor={"black"} borderBottomWidth={"3px"} />
            )}
          </VStack>
        ))}
      </Flex>
    </Box>
  );
};

export default SideNav;
