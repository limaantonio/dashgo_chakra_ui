import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiMoneyDollarBoxLine,
} from "react-icons/ri";

export default function Summary({ id, income, expense, total }) {
  return (
    <HStack mb="8" justify="space-between" align="center">
      <Box w="100%" key={id} borderRadius={8} bg="gray.800" p="8">
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">Entradas</Text>
          <RiArrowUpCircleLine color="green" size="28" />
        </Flex>

        <Text mt="4" fontSize="2xl" fontWeight="bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(income)}
        </Text>
      </Box>
      <Box w="100%" key={id} borderRadius={8} bg="gray.800" p="8">
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">Saídas</Text>
          <RiArrowDownCircleLine color="red" size="28" />
        </Flex>

        <Text mt="4" fontSize="2xl" fontWeight="bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(expense)}
        </Text>
      </Box>
      <Box w="100%" key={id} borderRadius={8} bg="gray.800" p="8">
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">Sado</Text>
          <RiMoneyDollarBoxLine color="orange" size="28" />
        </Flex>

        <Text mt="4" fontSize="2xl" fontWeight="bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)}
        </Text>
      </Box>
    </HStack>
  );
}
