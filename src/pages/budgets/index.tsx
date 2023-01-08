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
import {
  RiAddLine,
  RiArrowUpCircleLine,
  RiArrowDownCircleLine,
  RiMoneyDollarBoxLine,
  RiPencilLine,
  RiDeleteBack2Line,
} from "react-icons/ri";
import { Pagination } from "../../components/Pagination";
import Link from "next/link";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import AlertDelete from "../../components/AlertDelete";
import Summary from "../../components/Summary";

interface Budget {
  id: string;
  year: Number;
  totalAmount: Number;
  expenseAmount: Number;
  incomeAmount: Number;
  created_at: Date;
  updated_at: Date;
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);

  async function loadBudgets() {
    await api.get("budget").then((response) => setBudgets(response.data));
  }

  useEffect(() => {
    loadBudgets();
  }, [setBudgets]);

  async function handleDelete(id: string) {
    await api.delete(`budget/${id}`);

    const budgetIndex = budgets.findIndex((b) => b.id === id);
    const budget = [...budgets];

    budget.splice(budgetIndex, 1);
    setBudgets(budget);
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
        <Box flex="1">
          {budgets.map((budget) => (
            // eslint-disable-next-line react/jsx-key
            <Summary
              id={budget.id}
              income={budget.incomeAmount}
              expense={budget.expenseAmount}
              total={budget.totalAmount}
            />
          ))}

          <Box borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Orçamentos
              </Heading>
              <Link href="/budgets/create" passHref>
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
                  <Th>Ano</Th>
                  <Th>Mês</Th>
                  <Th>Data de atualização</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {budgets.map((budget) => (
                  // eslint-disable-next-line react/jsx-key
                  <Link href="/accounts">
                  <Tr cursor="pointer">
                    <Td px={["4", "4", "6"]}>
                      <Checkbox colorScheme="green"></Checkbox>
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{budget.budget.year}</Text>
                        <Text fontSize="sm" color="gray.300">
                          {format(
                            new Date(budget.budget.created_at),
                            "yyyy-MM-dd"
                          )}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{budget.budget.year}</Text>
                        <Text fontSize="sm" color="gray.300">
                          {format(
                            new Date(budget.budget.created_at),
                            "yyyy-MM-dd"
                          )}
                        </Text>
                      </Box>
                    </Td>

                    <Td>
                      {budget.updated_at ? (
                        format(new Date(budget.updated_at), "yyyy-MM-dd")
                      ) : (
                        <>-</>
                      )}
                    </Td>

                    <Td>
                      <HStack>
                        <Box ml="auto">
                          <Link href={`/budgets/edit?id=${budget.id}`}>
                            <Button
                              mr="2"
                              as="a"
                              size="sm"
                              fontSize="small"
                              colorScheme="purple"
                              leftIcon={
                                <Icon as={RiPencilLine} fontSize="16" />
                              }
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
                            leftIcon={
                              <Icon as={RiDeleteBack2Line} fontSize="16" />
                            }
                          >
                            Excluir
                          </Button>
                          <AlertDelete
                            isOpen={modalRemoveTool}
                            setIsOpen={toggleModalRemove}
                            handleRemove={() => handleDelete(budget.id)}
                          />
                        </Box>
                      </HStack>
                    </Td>
                  </Tr>
                  </Link>
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