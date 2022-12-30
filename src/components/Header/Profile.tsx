import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Antonio Carlos</Text>
          <Text color="gray.300" fontSize="small">
            limaantoniocarlos20@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Antonio Carlos"
        src="https://github.com/limaantonio.png"
      />
    </Flex>
  );
}
