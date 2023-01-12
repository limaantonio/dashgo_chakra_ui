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
                  <Th px={["4", "4", "6"]} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Nome</Th>
                  <Th>Valor</Th>
                  <Th>Parcelas</Th>
                  <Th>Total</Th>
                  <Th>Lançamentos</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultAccounts?.map((account) => (
                  // eslint-disable-next-line react/jsx-key
                  <Tr cursor="pointer">
                    <Td px={["4", "4", "6"]}>
                      <Checkbox colorScheme="green"></Checkbox>
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{account.account.name}</Text>
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
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(account.account.amount)}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">
                        {account.account.number_of_installments}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">
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
                      <Link href={`/entries?id=${account.account.id}`}>
                        <Text color="green.300" fontWeight="">
                          Vizualizar
                        </Text>
                      </Link>
                    </Td>

                    <Td>
                      <HStack>
                        <Box ml="auto">
                          <Link href={`/accounts/edit?id=${account.id}`}>
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
                            handleRemove={() => handleDelete(account.id)}
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
        </Box>
      </Flex>
    </Box>
  );
}
