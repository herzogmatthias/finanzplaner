import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import CreditForm from "@/components/personalForm/personalForm.component";
import AccountList from "@/components/accountList/accountList.component";  // Ensure this is the correct import path

const AddCreditPage = () => {
    return (
      <Box mt={8} ml={8}>
        <Heading>
          Hello User!
        </Heading>
        <Text fontSize="md" mt={4}>
          Here you can find and adjust your personal data.
        </Text>
        <Flex direction={{ base: "column", md: "row" }} mt={4} gap="20px">
          <Box flex="1" p={5} bg="white" boxShadow="md" borderRadius="md">
            <CreditForm />
          </Box>
          <Box flex="1" p={5} bg="white" boxShadow="md" borderRadius="md">
            <AccountList />
          </Box>
        </Flex>
      </Box> 
    );
};

export default AddCreditPage;
