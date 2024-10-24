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
  RiSubtractLine,
} from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid';

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

const type = 'EXPENSE'

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
})

export default function CreateSubAccount() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  })

  const errors = formState.errors

  const [items, setItems] = useState<Item[]>([])
  const [percentage, setPercentage] = useState<Number>(0.0)
  const [name, setName] = useState<string>('')
  const [income, setIncome] = useState<Number>(0.0)
  const [incomeAmount, setIncomeAmount] = useState(0.0)
  const [flagPrincipal, setFlagPrincipal] = useState(0)
  const [availableAmount, setAvailableAmount] = useState(0.0)
  const r = useRouter()
  const toast = useToast()

  useEffect(() => {
    api
      .get(`subaccount/budget/${r.query.budget}`)
      .then((response) => {
        const filteredItems = response.data.filter((item: { type: string }) => item.type === 'EXPENSE');
        setItems(filteredItems); // Atualiza o estado com os itens filtrados
      })
      .catch((error) => {
        console.error("Erro ao buscar subcontas:", error); // Adicionando tratamento de erro
      });

  }, []);

  useEffect(() => {
    api
      .get(`subaccount/balance/budget/${r.query.budget}`)
      .then((response) => setIncomeAmount(response.data.liquid_income - response.data.expense))
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

    if (
      //@ts-ignore
      type === 'INCOME') {
      //@ts-ignore
      amount = income
    } else {
      amount = calculed_expense
    }

    setIncomeAmount(incomeAmount - amount)

    const item = {
      id: uuidv4(),
      name,
      percentage,
      type,
      amount,
      principal,
      budget_id: r.query.budget,
    }
    console.log(item)
    //@ts-ignore
    setItems([...items, item])
  }

  function handleIncrement(id: string) {
    const itemIndex = items.findIndex((b) => b.id === id);
    const percentageTotal = items.reduce((acc, item) => Number(acc) + Number(item.percentage), 0);

    if (itemIndex !== -1) {
      const updatedItems = [...items];
      const currentPercentage = Number(updatedItems[itemIndex].percentage);
      const currentAmount = Number(updatedItems[itemIndex].amount);
      let newAmount = 0.0
      console.log(currentPercentage)

      if (percentageTotal < 100) {
        updatedItems[itemIndex].percentage = currentPercentage + 1;
        newAmount = currentAmount + (incomeAmount * 0.01);
        updatedItems[itemIndex].amount = newAmount;
        setItems(updatedItems);
      } else {
        toast({
          title: 'A soma das porcentagens não pode ser maior que 100%',
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      }
      
    } else {
      console.error(`Item com id ${id} não encontrado`);
    }
  }


  function handleSubstract(id: string) {
    const itemIndex = items.findIndex((b) => b.id === id);

    if (itemIndex !== -1) {
      const updatedItems = [...items];
      const currentPercentage = Number(updatedItems[itemIndex].percentage);
      const currentAmount = Number(updatedItems[itemIndex].amount);
      let newAmount = 0.0

      if (currentPercentage > 0) {
        updatedItems[itemIndex].percentage = currentPercentage - 1;
        newAmount = currentAmount - (incomeAmount * 0.01);
        updatedItems[itemIndex].amount = newAmount;
      } else {
        console.warn(`A porcentagem já está em 0%. Não é possível incrementar mais.`);
      }
      setItems(updatedItems);
    } else {
      console.error(`Item com id ${id} não encontrado`);
    }
  }

  async function handleDelete(id: string) {
    const find_id = await api.get(`subaccount/${id}`)

    if (find_id) {
      await api.delete(`subaccount/${id}`)
    }
 
    const itemIndex = items.findIndex((b) => b.id === id)
    const item = [...items]

    item.splice(itemIndex, 1)
    setItems(item)
  }

  return (
    <Box>
      <Header />

      <Flex my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box  flex="1" alignItems="center" display="flex" justifyContent="center" alignContent="center" flexDirection="row">

        <Box borderRadius={8} bg="gray.800" p={['6', '8']} w="80%" >
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
              Adicionar Categoria de Despesa
            </Heading>
            <Divider my="6" borderColor="gray.700" />
         
              <SimpleGrid minChildWidth="248px" spacing={['4', '6']}  flexDirection="row" display="flex" alignItems="end">
                  <Input
                    label="Valor Disponivel"
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => {
                      //@ts-ignore
                      setIncomeAmount(e.target.value)
                    } } isDisabled={true} name={''}                />
                <Input
                  label="Despesa"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                  //@ts-ignore
                  error={errors.name}
                />
                <Box >
                  <Button
                    colorScheme="purple"
                    type="submit"
                    isLoading={formState.isSubmitting}
                    leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  >
                    Adicionar
                  </Button>
              </Box>
              </SimpleGrid>
           
             <Heading size="sm" fontWeight="light" mt="10">
                Distribuição dos Gastos
            </Heading>
            <Divider my="6" borderColor="gray.700" />
           
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th>Despesa</Th>
                  <Th>Percentual</Th>
                  <Th>Valor</Th>
                  <Th></Th>
                
                </Tr>
              </Thead>
              <Tbody>
                {items?.map((entry, index) => (
                  // eslint-disable-next-line react/jsx-key 
                  <Tr cursor="pointer">
                    <Td>
                      <Text fontWeight="bold">{entry.name}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{`${entry.percentage}%`}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{String(entry.amount)}</Text>
                      </Td>
                    <Td>
                      <Box  flexDirection="row" display="flex" flex="1">
                        <Button color="black" size="sm" onClick={() => handleIncrement(entry.id)} >
                          <Icon as={RiAddLine} />
                        </Button>
                        <Button color="black" size="sm" onClick={() => handleSubstract(entry.id)} marginX="2">
                          <Icon as={RiSubtractLine} />
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleDelete(entry.id)}>
                          <Icon as={RiDeleteBin6Line} />
                          </Button>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total</Th>
                  <Th></Th>
                  <Th>
                    {items?.reduce(
                      (acc, item) => Number(acc) + Number(item.percentage),
                      0,
                    )}
                    %
                  </Th>
                  <Th>
                    {items?.reduce(
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
                  textColor="white.300"
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
          </Box>
      </Flex>
    </Box>
  )
}
