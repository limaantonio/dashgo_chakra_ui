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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { SideBar } from '../../../components/SideBar'
import { Header } from '../../../components/Header'
import {
  RiAddLine,
  RiArrowUpCircleLine,
  RiArrowDownCircleLine,
  RiMoneyDollarBoxLine,
  RiPencilLine,
  RiDeleteBack2Line,
  RiDeleteBin6Line,
  RiSearch2Line,
  RiArrowLeftLine,
} from 'react-icons/ri'
import { Pagination } from '../../../components/Pagination'
import Link from 'next/link'
import api from '../../../services/api'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import AlertDelete from '../../../components/AlertDelete'
import Summary from '../../../components/Summary'
import { SlOptionsVertical } from 'react-icons/sl'
import { useRouter } from 'next/router'

interface Budget {
  id: string
  year: Number
  totalAmount: Number
  expenseAmount: Number
  incomeAmount: Number
  created_at: Date
  updated_at: Date
}

export default function MonthList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [budgets, setBudgets] = useState<Budget[]>([])

  const router = useRouter()
  const { id } = router.query

  async function loadBudgets() {
    await api
      .get(`months/budget/${id}`)
      .then((response) => setBudgets(response.data))
  }

  useEffect(() => {
    loadBudgets()
  }, [setBudgets, id])

  async function handleDelete(id: string) {
    await api.delete(`budget/month/${id}`)

    const budgetIndex = budgets.findIndex((b) => b.id === id)
    const budget = [...budgets]

    budget.splice(budgetIndex, 1)
    setBudgets(budget)
  }

  const [modalRemoveTool, setModalRemoveTool] = useState(false)
  const [selectedSubAccountId, setSelectedSubAccountId] = useState(null)

  function openModalRemove(id: string) {
    setModalRemoveTool(true)
    //@ts-ignore
    setSelectedSubAccountId(id)
  }

  function toggleModalRemove(): void {
    setModalRemoveTool(!modalRemoveTool)
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box flex="1">
          {/* <Summary
              id={1}
              income={balance?.incomeAmount}
              expense={balance?.expenseAmount}
              total={balance?.totalAmount}
            /> */}
           <Link href="/budgets" passHref>
            <Button
              ml="-6"
              mb="6"
              _hover={{ bg: 'transparent', textColor: 'green.400' }}
              bg="transparent"
            >
              <RiArrowLeftLine fontSize="28" />
            </Button>
          </Link>

          <Box borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Orçamento Mensal
              </Heading>
              <Link href={`/months/create?id=${id}`} passHref>
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
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Mês</Th>
                  <Th>Data de atualização</Th>
                  <Th>Lançamentos</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(budgets) &&
                  budgets.map((budget) => (
                    <Tr key={budget.id} cursor="pointer">
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="green"></Checkbox>
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{
                            //@ts-ignore
                            budget.month}</Text>
                          <Text fontSize="sm" color="gray.300">
                            {format(new Date(budget.created_at), 'yyyy-MM-dd')}
                          </Text>
                        </Box>
                      </Td>

                      <Td>
                        {budget.updated_at ? (
                          format(new Date(budget.updated_at), 'yyyy-MM-dd')
                        ) : (
                          <>-</>
                        )}
                      </Td>

                      <Td>
                        <Link
                          href={`/budgets/months/entries?id=${budget.id}&budget=${//@ts-ignore
                            budget.budget_id}`}
                        >
                          <Button
                            mr="2"
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="gray.50"
                            textColor="white"
                            leftIcon={<Icon as={RiSearch2Line} fontSize="16" />}
                          />
                        </Link>
                      </Td>

                      <Td>
                        <Menu>
                          <MenuButton
                            bg="transparent"
                            _hover={{ bg: 'transparent' }}
                            as={Button}
                          >
                            <SlOptionsVertical />
                          </MenuButton>
                          <MenuList textColor="black">
                            <Link href={`/months/edit?id=${budget.id}`}>
                              <MenuItem as="button" _hover={{ bg: 'gray.50' }}>
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
                              onClick={() => openModalRemove(budget.id)}
                              as="button"
                              _hover={{ bg: 'gray.50' }}
                            >
                              <Button
                                mr="2"
                                as="a"
                                size="sm"
                                fontSize="small"
                                colorScheme="gray.50"
                                textColor="black"
                                leftIcon={
                                  <Icon
                                    textColor="red.400"
                                    as={RiDeleteBin6Line}
                                    fontSize="16"
                                  />
                                }
                              >
                                <Text textColor="red.400">Excluir</Text>
                              </Button>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
              <AlertDelete
                isOpen={modalRemoveTool}
                setIsOpen={toggleModalRemove}
                //@ts-ignore
                handleRemove={() => handleDelete(selectedSubAccountId)}
              />
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
