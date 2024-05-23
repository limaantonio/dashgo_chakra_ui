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
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import {
  RiAddLine,
  RiArrowUpCircleLine,
  RiArrowDownCircleLine,
  RiMoneyDollarBoxLine,
  RiPencilLine,
  RiDeleteBack2Line,
  RiDeleteBin6Line,
  RiSearch2Line,
} from 'react-icons/ri'
import { Pagination } from '../../components/Pagination'
import Link from 'next/link'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { format, set } from 'date-fns'
import AlertDelete from '../../components/AlertDelete'
import Summary from '../../components/Summary'
import { SlOptionsVertical } from 'react-icons/sl'

interface Budget {
  id: string
  year: Number
  totalAmount: Number
  expenseAmount: Number
  incomeAmount: Number
  created_at: Date
  updated_at: Date
}

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [budgets, setBudgets] = useState<Budget[]>([])
  const [selectedSubAccountId, setSelectedSubAccountId] = useState(null)

  //@ts-ignore
  const getFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error)
      return null
    }
  }

  async function loadBudgets() {
    await api.get(`budget/user/${user}`).then((response) => setBudgets(response.data))
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    const userId = getFromLocalStorage('user')
    if (userId) {
      setUser(userId) 
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadBudgets()
    }
  }, [user])

  async function handleDelete(id: string) {
    await api.delete(`budget/${id}`)

    const updatedBudgets = budgets.filter((budget) => budget.id !== id)
    setBudgets(updatedBudgets)
    loadBudgets()
  }

  const [modalRemoveTool, setModalRemoveTool] = useState(false)

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
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Ano</Th>
                  <Th>Data de atualização</Th>
                  <Th>Contas</Th>
                  <Th>Orçamento Mensal</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {budgets.map((budget) => (
                  <Tr key={
                     //@ts-ignore
                    budget.budget.id} cursor="pointer">
                    <Td px={['4', '4', '6']}>
                      <Checkbox colorScheme="green"></Checkbox>
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{
                           //@ts-ignore
                          budget.budget.year}</Text>
                        <Text fontSize="sm" color="gray.300">
                          {format(
                            new Date(
                               //@ts-ignore
                              budget.budget.created_at),
                            'yyyy-MM-dd',
                          )}
                        </Text>
                      </Box>
                    </Td>

                    <Td>
                      {
                        //@ts-ignore
                        budget.budget.updated_at ? (
                          format(new Date(
                             //@ts-ignore
                            budget.budget.updated_at), 'yyyy-MM-dd')
                      ) : (
                        <>-</>
                      )}
                    </Td>
                    <Td>
                      <Link href={`/budgets/accounts?id=${
                         //@ts-ignore
                        budget.budget.id}`}>
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
                      <Link href={`/budgets/months?id=${
                        //@ts-ignore
                        budget.budget.id}`}>
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
                          <Link href={`/budgets/edit?id=${
                             //@ts-ignore
                            budget.budget.id}`}>
                            <MenuItem as="button" _hover={{ bg: 'gray.50' }}  bg="transparent"  textColor="white.300">
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
                            onClick={() => openModalRemove(
                              //@ts-ignore
                              budget.budget.id)}
                            as="button"
                            textColor={'white'}
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
                handleRemove={() => handleDelete(
                //@ts-ignore
                  selectedSubAccountId)}
              />
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
