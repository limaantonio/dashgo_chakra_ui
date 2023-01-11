import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  HStack,
  Tbody,
  Td,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import {
  RiAddLine,
  RiArrowDownSFill,
  RiDeleteBin6Line,
  RiPencilLine,
} from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import { useRouter } from "next/router";

interface Account {
  id: string;
  name: string;
  amount: Number;
  type: string;
  entry: Entry;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

interface Balance {
  id: string;
  month: Number;
}

interface Entry {
  id: string;
  description: string;
  amount: Number;
  account: {
    id: string;
    name: string;
    amount: Number;
    number_of_installments: Number;
  };
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter();
  const { id } = router.query;

  const balances = [
    {
      id: 1,
      month: "Janeiro",
    },
    {
      id: 2,
      month: "Fevereiro",
    },
    {
      id: 3,
      month: "Março",
    },
    {
      id: 4,
      month: "Abril",
    },
    {
      id: 5,
      month: "Maio",
    },
    {
      id: 6,
      month: "Junho",
    },
    {
      id: 7,
      month: "Julho",
    },
    {
      id: 8,
      month: "Agosto",
    },
    {
      id: 9,
      month: "Setembro",
    },
    {
      id: 10,
      month: "Outubro",
    },
    {
      id: 11,
      month: "Novembro",
    },
    {
      id: 12,
      month: "Dezembro",
    },
  ];
  const [balance, setBalance] = useState(1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [accounts, setAccounts] = useState<Account>();

  useEffect(() => {
    getAccount();
  }, [id, balance]);

  async function getAccount() {
    await api
      .get(`entry?month=${balance}`)
      .then((response) => setEntries(response.data));
    console.log(entries);
  }

  async function getByMonth(month: Number) {
    setBalance(month);
  }

  async function handleDelete(id: string) {
    await api.delete(`entry/${id}`);

    const entryIndex = entries.findIndex((b) => b.id === id);
    const entry = [...entries];

    entry.splice(entryIndex, 1);
    setEntries(entry);
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
              Lançamentos
            </Heading>
            <Box>
              <Menu>
                <MenuButton
                  bg="blue.400"
                  as={Button}
                  mr="4"
                  rightIcon={<RiArrowDownSFill />}
                >
                  Filtrar
                </MenuButton>
                <MenuList textColor="black">
                  <MenuGroup title="Balanço">
                    {balances.map((b) => (
                      <MenuItem
                        as="button"
                        bg={b.id === balance ? "gray.50" : "white"}
                        _hover={{ bg: "gray.50" }}
                        onClick={() => {
                          getByMonth(b.id);
                        }}
                        key={b.id}
                        value={b.month}
                      >
                        {b.month}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th px={["4", "4", "6"]} color="gray.300" width="8">
                  <Checkbox colorScheme="green"></Checkbox>
                </Th>
                <Th>Conta</Th>
                <Th>Mês</Th>
                <Th>Valor</Th>
                <Th>Parcela</Th>
                <Th>Status</Th>
                <Th>Items</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {entries?.map((entry) => (
                <Tr key={entry.id}>
                  <Td px={["4", "4", "6"]}>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Td>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{entry.description}</Text>
                      {entries.type === "INCOME" ? (
                        <Text fontSize="sm" color="blue.300">
                          Receita
                        </Text>
                      ) : (
                        <Text fontSize="sm" color="red.300">
                          Despesa
                        </Text>
                      )}
                    </Box>
                  </Td>
                  <Td>
                    <Text>{entry.month}</Text>
                  </Td>
                  <Td>
                    <Text fontWeight="bold">
                      {" "}
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(entry.amount)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight="bold">{entry.installment}</Text>
                  </Td>

                  <Td>Pago</Td>
                  <Td>
                    <Link href={`/items?id=${entry.id}`}>
                      <Text color="green.300" fontWeight="">
                        Vizualizar
                      </Text>
                    </Link>
                  </Td>

                  <Td>
                    <HStack>
                      <Box ml="auto">
                        <Link href={`/entries/edit?id=${entry.entry_id}`}>
                          <Button
                            mr="2"
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="purple"
                          >
                            <Icon as={RiPencilLine} fontSize="16" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => openModalRemove()}
                          as="a"
                          size="sm"
                          fontSize="small"
                          colorScheme="red"
                        >
                          <Icon as={RiDeleteBin6Line} fontSize="16" />
                        </Button>
                        <AlertDelete
                          isOpen={modalRemoveTool}
                          setIsOpen={toggleModalRemove}
                          handleRemove={() => handleDelete(entry.entry_id)}
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
