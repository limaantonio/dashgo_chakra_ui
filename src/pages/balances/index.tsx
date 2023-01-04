import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";

interface Balance {
  id: string;
  month: Number;
  created_at: Date;
  updated_at: Date;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [balances, setbalances] = useState<Balance[]>([]);

  useEffect(() => {
    api.get("balance").then((response) => setbalances(response.data));
  }, []);

  async function handleDelete(id: string) {
    await api.delete(`balance/${id}`);

    const balancetIndex = balances.findIndex((b) => b.id === id);
    const balance = [...balances];

    balance.splice(balancetIndex, 1);
    setbalances(balance);
  }

  const [modalRemoveTool, setModalRemoveTool] = useState(false);

  function openModalRemove() {
    setModalRemoveTool(true);
  }

  function toggleModalRemove(): void {
    setModalRemoveTool(!modalRemoveTool);
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Balanços
            </Heading>
            <Link href="/balances/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="small"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th px={["4", "4", "6"]} color="gray.300" width="8">
                  <Checkbox colorScheme="green"></Checkbox>
                </Th>
                <Th>Mês</Th>
                {isWideVersion && <Th>Data de atualização</Th>}
                <Th width=""></Th>
              </Tr>
            </Thead>
            <Tbody>
              {balances.map((balance) => (
                // eslint-disable-next-line react/jsx-key
                <Tr>
                  <Td px={["4", "4", "6"]}>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Td>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{balance.month}</Text>
                      <Text fontSize="sm" color="gray.300">
                        {format(new Date(balance.created_at), "yyyy-MM-dd")}
                      </Text>
                    </Box>
                  </Td>
                  {isWideVersion && (
                    <Td>
                      {balance.updated_at ? (
                        format(new Date(balance.updated_at), "yyyy-MM-dd")
                      ) : (
                        <>-</>
                      )}
                    </Td>
                  )}
                  <Td>
                    <HStack>
                      <Box ml="auto">
                        <Link href={`/balances/edit?id=${balance.id}`}>
                          <Button
                            mr="2"
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          >
                            Editar
                          </Button>
                        </Link>

                        <Button
                          onClick={() => openModalRemove()}
                          as="a"
                          size="sm"
                          fontSize="small"
                          colorScheme="red"
                          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                        >
                          Excluir
                        </Button>
                        <AlertDelete
                          isOpen={modalRemoveTool}
                          setIsOpen={toggleModalRemove}
                          handleRemove={() => handleDelete(balance.id)}
                        />
                      </Box>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination />
        </Box>
      </Flex>
    </Box>
  );
}
