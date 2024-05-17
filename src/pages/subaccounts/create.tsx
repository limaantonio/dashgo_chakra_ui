import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  Icon,
  Tfoot,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Text,
  Td,
} from '@chakra-ui/react'
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import { Input } from '../../components/Form/Input'
import  Select  from '../../components/Form/Select'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler } from 'react-hook-form/dist/types'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import router from 'next/router'
import { useRouter } from 'next/router'
import {
  RiAddLine,
  RiArrowLeftLine,
  RiDeleteBin6Line,
  RiSave2Fill,
} from 'react-icons/ri'

type CreateSubAccountFormData = {
  name: string
  type: string
  percentage: Number
  amount: Number
  principal: boolean
}

interface Item {
  id: string
  name: string
  percentage: Number
  type: string
  amount: Number
  principal: boolean
}

enum AccountType {
  income = 'INCOME',
  expanse = 'EXPENSE',
}

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
})

export default function CreateSubAccount() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  })

  const errors = formState.errors

  const typeAccount = [
    { id: 1, value: 'INCOME', label: 'Receita' },
    { id: 2, value: 'EXPENSE', label: 'Despesa' },
  ]

  const [items, setItems] = useState<Item[]>([])
  const [percentage, setPercentage] = useState<Number>(0.0)
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<AccountType>(AccountType.income)
  const [income, setIncome] = useState<Number>(0.0)
  const [incomeAmount, setIncomeAmount] = useState(0.0)
  const [flagPrincipal, setFlagPrincipal] = useState(0)
  const r = useRouter()
  const toast = useToast()

  useEffect(() => {
    api
      .get('subaccount/balance')
      .then((response) => setIncomeAmount(response.data.liquid_income))
  }, [])

  const hangleCreateSubAccount: SubmitHandler<
    CreateSubAccountFormData
  > = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const res = await api.post('subaccount', items)

    if (res && res.status === 200) {
      router.push(`/subaccounts`)
    } else {
      toast({
        title: 'Erro ao criar lançamento.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  function addItem(e: Event) {
    e.preventDefault()
    //@ts-ignore
    const calculed_expense = incomeAmount * (percentage / 100)
    const principal = flagPrincipal == 1 ? true : false
    let amount = 0.0

    if (type === 'INCOME') {
      //@ts-ignore
      amount = income
    } else {
      amount = calculed_expense
    }

    const item = {
      name,
      percentage,
      type,
      amount,
      principal,
    }
    //@ts-ignore
    setItems([...items, item])
  }

  async function handleDelete(id: string) {
    const itemIndex = items.findIndex((b) => b.id === id)
    const item = [...items]

    item.splice(itemIndex, 1)
    setItems(item)
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={['6', '8']}>
          <Box
            as="form"
            //@ts-ignore
            onSubmit={addItem}
            flex="1"
            borderRightRadius={8}
            bg="gray.800"
            p={['6', '8']}
          >
            <Heading size="md" fontWeight="normal">
              Adicionar Classificação
            </Heading>
            <Divider my="6" borderColor="gray.700" />
            <VStack spacing="8">
              <SimpleGrid minChildWidth="248px" spacing={['6', '8']} w="100%">
                <Input
                  label="Nome"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                  //@ts-ignore
                  error={errors.name}
                />
                <SimpleGrid minChildWidth="248px" spacing={['6', '8']} w="100%">
                  <Select
                    label="Tipo"
                    placeholder="Selecione"
                     //@ts-ignore
                    options={typeAccount}
                    value={type}
                     //@ts-ignore
                    onChange={(value) => {
                      //@ts-ignore
                      setType(value)
                    }}
                  />
                </SimpleGrid>
                <Input
                  label="Percentual"
                  type="number"
                  //@ts-ignore
                  value={percentage}
                  onChange={(e) => {
                    //@ts-ignore
                    setPercentage(e.target.value)
                  }}
                  //error={errors.number_of_installments}
                  isDisabled={type === 'EXPENSE' ? false : true}
                />

                <Input
                  label="Valor"
                  type="number"
                  //@ts-ignore
                  value={income}
                  onChange={(e) => {
                    //@ts-ignore
                    setIncome(e.target.value)
                  }}
                  isDisabled={type === 'INCOME' ? false : true}
                  //error={errors.number_of_installments}
                />

                <Input
                  label="Valor Disponivel"
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => {
                    //@ts-ignore
                    setIncomeAmount(e.target.value)
                  } }
                  isDisabled={true} name={''}                  //error={errors.number_of_installments}
                />
                <Input
                  label="Receita principal"
                  type="number"
                  value={flagPrincipal}
                  onChange={(e) => {
                    //@ts-ignore
                    setFlagPrincipal(e.target.value)
                  } }
                  isDisabled={type === 'EXPENSE' ? true : false} name={''}                  //error={errors.number_of_installments}
                />
              </SimpleGrid>
            </VStack>
            <Box my="8">
              <Button
                colorScheme="purple"
                type="submit"
                isLoading={formState.isSubmitting}
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Adicionar
              </Button>
            </Box>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Type</Th>
                  <Th>Percentual</Th>
                  <Th>Valor</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((entry) => (
                  // eslint-disable-next-line react/jsx-key
                  <Tr cursor="pointer">
                    <Td>
                      <Text fontWeight="bold">{entry.name}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{entry.type}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{`${entry.percentage}%`}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{String(entry.amount)}</Text>
                    </Td>

                    <Td>
                      <HStack>
                        <Box ml="auto">
                          <Button
                            onClick={() => handleDelete(entry.id)}
                            as="a"
                            size="sm"
                            fontSize="small"
                            colorScheme="red"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                          >
                            <Icon as={RiDeleteBin6Line} fontSize="16" />
                          </Button>
                        </Box>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total</Th>
                  <Th></Th>
                  <Th>
                    {items.reduce(
                      (acc, item) => Number(acc) + Number(item.percentage),
                      0,
                    )}
                    %
                  </Th>
                  <Th>
                    {items.reduce(
                      (acc, item) => Number(acc) + Number(item.amount),
                      0,
                    )}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>

          <Flex mt="8" justify="flex-end">
            <Box>
              <Link href="/subaccounts" passHref>
                <Button
                  ml="6"
                  _hover={{ bg: 'transparent', textColor: 'green.400' }}
                  bg="transparent"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                //@ts-ignore
                onClick={() => hangleCreateSubAccount()}
                leftIcon={<RiSave2Fill />}
              >
                Salvar
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
