import { Flex, Heading, Icon, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { RiSearchLine } from "react-icons/ri";

export function SeachBox({value = ''}) {
  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml="2"
      maxWidth="400"
      alignSelf="center"
      position="relative"
    >
      <Heading size="lg" fontWeight="normal">
              {value}
              </Heading>
    </Flex>
  );
}
