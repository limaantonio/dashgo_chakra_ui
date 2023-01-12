import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
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
import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowLeftLine,
  RiDeleteBin6Line,
  RiFilter2Line,
  RiPencilLine,
} from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import Summary from "../../components/Summary";
import SummaryAccount from "../../components/SummaryAccount";
import { SlOptionsVertical } from "react-icons/sl";

interface Account {
  id: string;
  name: string;
  amount: Number;
  type: string;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

interface ListAccount {
  account: Account[];
  incomeAmount: Number;
  expenseAmount: Number;
  totalAmount: Number;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [resultAccounts, setResultAccounts] = useState();

  useEffect(() => {
    api.get("account").then((response) => setResultAccounts(response.data));
  }, []);

  async function handleDelete(id: string) {
    await api.delete(`account/${id}`);

    const budgetIndex = accounts.findIndex((b) => b.id === id);
    const budget = [...accounts];

    budget.splice(budgetIndex, 1);
    setAccounts(budget);
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
      <Link href="/budgets" passHref>
        <Button
          ml="6"
          _hover={{ bg: "transparent", textColor: "green.400" }}
          bg="transparent"
        >
          <RiArrowLeftLine fontSize="28" />
        </Button>
      </Link>
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box flex="1">
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Contas
              </Heading>
              <Box>
                <Link href="/accounts/create" passHref>
                  <Button
                    as="a"
                    size="md"
                    fontSize="small"
                    colorScheme="green"
                    leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  >
                    Criar novo
                  </Button>
                </Link>
              </Box>
            </Flex>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Parcelas</Th>
                  <Th>V. Total</Th>
                  <Th>Usado</Th>
                  <Th>Disponivel</Th>
                  <Th>Lançamentos</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultAccounts?.map((account) => (
                  <Tr key="account.id" cursor="pointer">
                    <Td>
                      <Box>
                        <Text fontWeight="">{account.account.name}</Text>
                        {account.account.type === "INCOME" ? (
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
                      <Text fontWeight="bold">
                        {account.account.number_of_installments}
                      </Text>
                    </Td>

                    <Td>
                      <Text fontWeight="">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(
                          account.account.amount *
                            account.account.number_of_installments
                        )}
                      </Text>
                    </Td>

                    <Td>
                      <Text textColor="red.300" fontWeight="">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(account.balance.used_value)}
                      </Text>
                    </Td>

                    <Td>
                      <Text textColor="blue.300" fontWeight="">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(account.balance.available_value)}
                      </Text>
                    </Td>

                    <Td>
                      <Link href={`/entries?id=${account.account.id}`}>
                        <Text color="green.300" fontWeight="">
                          Vizualizar
                        </Text>
                      </Link>
                    </Td>

                    <Td>
                      <Menu>
                        <MenuButton
                          bg="transparent"
                          _hover={{ bg: "transparent" }}
                          as={Button}
                        >
                          <SlOptionsVertical />
                        </MenuButton>
                        <MenuList textColor="black">
                          <Link href={`/accounts/edit?id=${account.id}`}>
                            <MenuItem as="button" _hover={{ bg: "gray.50" }}>
                              <Button
                                mr="2"
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="gray.50"
                                textColor="black"
                                leftIcon={
                                  <Icon as={RiPencilLine} fontSize="16" />
                                }
                              >
                                Editar
                              </Button>
                            </MenuItem>
                          </Link>
                          <MenuItem
                            onClick={() => openModalRemove()}
                            as="button"
                            _hover={{ bg: "gray.50" }}
                          >
                            <Button
                              mr="2"
                              as="a"
                              size="sm"
                              fontSize="small"
                              colorScheme="gray.50"
                              textColor="red.400"
                              leftIcon={
                                <Icon as={RiDeleteBin6Line} fontSize="16" />
                              }
                            >
                              <Text textColor="red.400">Excluir</Text>
                            </Button>
                          </MenuItem>
                        </MenuList>
                      </Menu>

                      <AlertDelete
                        isOpen={modalRemoveTool}
                        setIsOpen={toggleModalRemove}
                        handleRemove={() => handleDelete(account.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
