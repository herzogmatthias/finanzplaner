import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import CreditForm from "@/components/personalForm/personalForm.component";
import AccountList from "@/components/accountList/accountList.component";  // Ensure this is the correct import path

const AddCreditPage = () => {
    return (
      <Box mt={8} ml={8}>
      <Heading>
        Hello User!
      </Heading>
      <Text fontSize="md">
        Here you can find and adjust your personal data.
      </Text>
      <Box >
        <Flex mt={0} direction={{ base: "column", md: "row" }} gap="20px" alignItems="flex-start">
          <Box flex={{ base: "1", md: "0 0 50%" }} p={5} bg="white" >
            <CreditForm />
          </Box>
          <Box flex={{ base: "1", md: "1" }} p={5} bg="white" >
            <AccountList />
          </Box>
        </Flex>
      </Box>
    </Box>
    );
};

export default AddCreditPage;
