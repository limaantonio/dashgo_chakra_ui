import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Th,
  Thead,
  Tfoot,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import { RiAddLine, RiDeleteBin6Line, RiPencilLine } from 'react-icons/ri'
import { SlOptionsVertical } from 'react-icons/sl'
import { Pagination } from '../../components/Pagination'
import Link from 'next/link'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import AlertDelete from '../../components/AlertDelete'
import { useRouter } from 'next/router'
import Summary from '../../components/Summary'

interface SubAccount {
  id: string
  name: string
  amount: Number
  type: string
  percentage: Number
  created_at: Date
  updated_at: Date
}

interface Balance {
  income?: Number
  expense?: Number
  liquid_income?: Number
}

export default function SubAccountList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const router = useRouter()
  const { id } = router.query
  const [balance, setBalance] = useState<Balance>()
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([])
  const [modalRemoveTool, setModalRemoveTool] = useState(false)
  const [selectedSubAccountId, setSelectedSubAccountId] = useState(null)
  const [budget, setBudget] = useState(null)

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

  async function loadAccount() {
    await api
      .get(`subaccount/budget/${budget}`)
      .then((response) => setSubAccounts(response.data))
    await api
      .get(`subaccount/balance/budget/${budget}`)
      .then((response) => setBalance(response.data))
  }

  useEffect(() => {
   
    const budgetIt = getFromLocalStorage('budget')
    if (budgetIt) {
      setBudget(budgetIt) 
    }
     
  }, [setSubAccounts, setBalance, id])

  useEffect(() => {
    if (budget) {
      loadAccount()
    }
  }, [budget])

  async function handleDelete(id: string) {
    await api.delete(`subaccount/${id}`)

    setSubAccounts((prevSubAccounts) =>
      prevSubAccounts.filter((item) => item.id !== id),
    )
  }

  function openModalRemove(id: string) {
    setModalRemoveTool(true)
    //@ts-ignore
    setSelectedSubAccountId(id)
  }

  function toggleModalRemove(): void {
    setModalRemoveTool(!modalRemoveTool)
  }

  console.log(subAccounts)

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box flex="1">
          <Summary
            id={1}
            income={balance?.income}
            expense={balance?.expense}
            //@ts-ignore
            total={balance?.liquid_income - balance?.expense}
            liquid_income={balance?.liquid_income}
          />
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Classificação de contas
              </Heading>
              <Box>
                <Link href={`/subaccounts/create?budget=${budget}`} passHref>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="small"
                    colorScheme="green"
                    leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  >
                    Criar Subcontas
                  </Button>
                </Link>
              </Box>
            </Flex>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Conta</Th>
                  <Th>Percentual</Th>
                  <Th>Valor</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(subAccounts) &&
                  subAccounts.map((subAccount) => (
                    <Tr key={subAccount?.id} cursor="pointer">
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="green"></Checkbox>
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{subAccount?.name}</Text>
                          {subAccount?.type === 'INCOME' ? (
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
                        <Text>{String(subAccount?.percentage)}%</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold">
                          {' '}
                          {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            //@ts-ignore
                            currency: 'BRL',
                            //@ts-ignore
                          }).format(subAccount?.amount)}
                        </Text>
                      </Td>
                      <Td>
                        <Link href={`/items?id=${subAccount?.id}`}>
                          <Text color="green.300" fontWeight="">
                            Visualizar
                          </Text>
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
                            <Link
                              href={`/subaccounts/edit?id=${subAccount?.id}`}
                            >
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
                              onClick={() => openModalRemove(subAccount.id)}
                              as="button"
                              _hover={{ bg: 'gray.50' }}
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
                      </Td>
                    </Tr>
                  ))}
                <AlertDelete
                  isOpen={modalRemoveTool}
                  setIsOpen={toggleModalRemove}
                  //@ts-ignore
                  handleRemove={() => handleDelete(selectedSubAccountId)}
                />
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total</Th>
                  <Th></Th>
                  <Th>
                    {subAccounts?.reduce(
                      (acc, item) => Number(acc) + Number(item.percentage),
                      0,
                    )}
                    %
                  </Th>
                  <Th></Th>
                </Tr>
              </Tfoot>
            </Table>
            <Pagination />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
