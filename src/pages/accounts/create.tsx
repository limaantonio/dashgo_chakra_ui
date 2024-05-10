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
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useToast } from "@chakra-ui/react";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiDeleteBin6Line,
  RiSave2Fill
} from "react-icons/ri";

type CreateAccountFormData = {
  name: string;
  amount: Number;
  type: AccountType;
  number_of_installments: Number;
  sub_account: SubAccountType;
};

interface Budget {
  id: string;
  year: Number;
  created_at: Date;
  updated_at: Date;
}

const createFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  amount: yup.string().required("Valor obrigatório"),
});

export default function CreateBudget() {
  const router = useRouter()
  const { id } = router.query

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateBudget: SubmitHandler<CreateAccountFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    try {
      await api.post(`account/budget/${id}`, items);
      router.push(`/accounts?id=${id}`)
    } catch (error) {
     if (error.response.data.error == 'Saldo insuficiente') {
      toast({
              title: "Saldo insuficiente",
              status: "error",
              duration: 9000,
              isClosable: true,
          });
      }     
    }
  };


  const [budgets, setBudgets] = useState<Budget[]>([]);


  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, []);

  useEffect(() => {
    api.get("subaccount").then((response) => setSubAccounts(response.data));
  }, []);


  const [subAccounts, setSubAccounts] = useState<Account[]>([]);
  const [subAccount, setSubAccount] = useState();
  const [type, setType] = useState();
  const [items, setItems] = useState([]);

  function transformDataToOptions() {
    const selectSubAccounts = [];
    subAccounts?.map(
      (budget) =>
      (selectSubAccounts.push({
        id: budget.id,
        value: budget.id,
        label: budget.name
      }),
    ));
    return selectSubAccounts
  }

  function selectionSubAccount(value) {
    const subAccount = subAccounts.find((subAccount) => subAccount.id === value);
    setType(subAccount.type)
    setSubAccount(subAccount);

  }

  const toast = useToast();

  const format = (val) => `R$` + val
  const parse = (val) => val.replace(/^\$/, '')

  const [value, setValue] = useState(0.00)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0.00)
  const [number_of_installments, setNumber_of_installments] = useState(0)

  function addItem(e: Event) {
    e.preventDefault();

    

    const item = {
      name, 
      amount,
      number_of_installments,
      sub_account_id: subAccount.id,
    }

    setItems([...items, item]);    
  }


  async function handleDelete(id: string) {
    const itemIndex = items.findIndex((b) => b.id === id)
    const item = [...items]

    item.splice(itemIndex, 1)
    setItems(item)
  }

  function verifyAvailableValue() {
   const total = subAccount?.amount - items.reduce(
                      (acc, item) => Number(acc) + Number(item.amount),
                      0,
    ) 

    return total
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={['6', '8']}>
          <Box
            as="form"
            onSubmit={addItem}
            flex="1"
            borderRightRadius={8}
            bg="gray.800"
            p={['6', '8']}
          >
            <Heading size="lg" fontWeight="normal">
              Criar Conta
            </Heading>
            <Divider my="6" borderColor="gray.700" />
            <VStack spacing="6" paddingY="6">
              <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">

                <Select
                  label="Sub-Conta"
                  {...register("sub_account_id")}
                  onChange={(e) => selectionSubAccount(e.target.value)}
                  placeholder="Selecione"
                  options={transformDataToOptions()}
                />

              <Input
                label="Tipo"
                type="text"
                value={type ? type.toString() : ''}
                isDisabled={true}
                />
                
                <Input
                label="Dotação"
                type="number"
                value={subAccount?.amount ? subAccount.amount.toString() : ''}
                disabled={true}
              />
               <Input
                label="Disponível"
                type="number"
                value={
                  verifyAvailableValue()
                  }
                disabled={true}
                />

              </SimpleGrid>
            </VStack>
            <VStack spacing="8">
              <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
                <Input
                  label="Nome"
                  type="text"
                  {...register("name")}
                  error={errors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />

                <Input
                  label="Valor"
                  type="text"
                  {...register("amount")}
                  error={errors.amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  value={amount}
                />

                <Input
                  label="Número de parcelas"
                  type="number"
                  {...register("number_of_installments")}
                  error={errors.number_of_installments}
                  value={number_of_installments}
                  onChange={(e) => {
                    setNumber_of_installments(e.target.value);
                  }}
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
                  <Th>Valor</Th>
                  <Th>Parcelas</Th>
                  <Th>Subconta</Th>
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
                      <Text fontWeight="bold">{entry.amount}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{entry.number_of_installments}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{entry.subAccount}</Text>
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
                      (acc, item) => Number(acc) + Number(item.amount),
                      0,
                    )}
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href={`/accounts?id=${id}`} passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                type="submit"
                onClick={() => hangleCreateBudget()}
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
