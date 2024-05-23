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
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Text,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import { SideBar } from "../../../../components/SideBar";
import { Header } from "../../../../components/Header";
import { Input } from "../../../../components/Form/Input";
import  Select  from "../../../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../../../services/api";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import router from "next/router";
import { useRouter } from "next/router";
import { RiAddLine, RiArrowLeftLine, RiDeleteBin6Line, RiPencilLine, RiSave2Fill } from "react-icons/ri";
import { set } from "date-fns";

type CreateEntryFormData = {
  status: string;
  account_id: string;
  item: Item;

};

interface Account {
  id: string;
  name: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

interface Item {
  id: string;
  name?: string;
  qtde?: Number;
  account: Account;
  entry: Entry;
}

interface Entry {
  id: string; 
  description?: string;
  installment?: Number;
  budget_month_id: string;
}

const createFormSchema = yup.object().shape({
  //description: yup.string().required("Valor obrigatório"),
  installment: yup.string().required("Parcela obrigatória"),
  //amount: yup.string().required("Valor obrigatório"),
});

const statusList = [{
  id: 1,
  label: 'Pendente',
  value: 'PENDING'
}, {
  id: 2,
  label: 'Pago',
  value: 'CLOSED'
}]

export default function CreateBudget() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;
  
  const [items, setItems] = useState<Item[]>([])
  const [amount, setAmount] = useState<Number>(0);
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState()
  const r = useRouter();
  const { id, budget_month } = r.query;

  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const entry = values
    //@ts-ignore
    entry.account_id = account.account.id
    //@ts-ignore
    entry.status = status
    //@ts-ignore
    entry.budget_month_id = budget_month

    const data = {
      entry,
      items
    }
    
    try {
      await api.post("item", data);
      //@ts-ignore
      router.push(`/entries?id=${data.entry.budget_month_id}&budget=${id}`);
    } catch (error) {
      //@ts-ignore
      if (error.response.data.error == 'Insufficient funds') {
      toast({
              title: "Saldo insuficiente",
              status: "error",
              duration: 9000,
              isClosable: true,
          });
      }     
    }

  };

  function addItem(e: Event) {
    e.preventDefault()
    const item = {
      name, 
      amount,
    }
    //@ts-ignore
    setItems([...items, item])
  }

async function handleDelete(id: string) {
 
  const itemIndex = items.findIndex((b) => b.id === id);
  const item = [...items];

  item.splice(itemIndex, 1);
  setItems(item);
}

const [accounts, setAccounts] = useState<Account[]>([]);
const [account, setAccount] = useState(0);
const [amountItem, setAmountItem] = useState(0);
const [available_value, setAvaliableValue] = useState(0);

  useEffect(() => {
    api.get(`account/budget/${id}`).then((response) => setAccounts(response.data));
  }, []);

  function transformDataAccountToOptions() {
  //@ts-ignore
  let selectAccount = []

  accounts?.map(
    (account) =>
    (selectAccount.push({
        //@ts-ignore
      id: account.account.id,
      //@ts-ignore
      value: account.account.id,
      //@ts-ignore
      label: account.account.name
    })),
  ); // Add closing parenthesis here

  //@ts-ignore
  return selectAccount
  }
  
  //@ts-ignore
  function selectionAccount(value) {
    //@ts-ignore
    const _account = accounts.find((subAccount) => subAccount.account.id === value);
    //@ts-ignore
    setAccount(_account);
    
  }

  

  function verifyAvailableValue() {
    //@ts-ignore
    const total = account?.balance?.available_value - items.reduce(
   //@ts-ignore
                      (acc, item) => Number(acc) + Number(item.amount),
                      0,
    ) 

    return total
  }

const toast = useToast();

  return (
    <Box>
      <Header />
      <Link href="/entries" passHref>
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
        <Box
          as="form"
          //@ts-ignore
          onSubmit={handleSubmit(hangleCreateEntry)}
          flex="1"
          borderLeftRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Lançamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select {...register("account_id")}
                 //@ts-ignore
                placeholder="Selecione" label="Conta" options={transformDataAccountToOptions()} onChange={(value) => selectionAccount(value)} />
            </SimpleGrid>
          </VStack>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <HStack>
              <Input
                label="Dotação"
                  type="number"
                  //@ts-ignore
                  value={account?.balance?.available_value}
                  //@ts-ignore
                disabled={true}
              />
               <Input
                label="Disponível"
                type="number"
                value={
                  verifyAvailableValue()
                  }
                  //@ts-ignore
                disabled={true}
                />
                </HStack>
              <Input
                label="Descrição"
                type="text"
                {...register("description")}
                 //@ts-ignore
                isRequired={false}
              />
              <HStack>
              <Input
                label="Parcela"
                type="number"
                  {...register("installment")}
                   //@ts-ignore
                error={errors.installment}
              />
              
              <Select
                label="Status"
                {...register("status")}
                  placeholder="Selecione"
                   //@ts-ignore
                  options={statusList}
                  //@ts-ignore
                  onChange={(value) => setStatus(value)}           
              />
                 
              </HStack>
             
            </SimpleGrid>
          
          </VStack>
          <Flex mt="8" >
            <HStack spacing="4">
             
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                leftIcon={<RiSave2Fill />}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
        
        <Box
          as="form"
          //@ts-ignore
          onSubmit={addItem} 
          flex="1"
          borderRightRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="md" fontWeight="normal">
           Adicionar Item
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Input
                label="Nome"
                type="text"
                value={name}

                onChange={(e) => {
                  setName(e.target.value);
                } } name={""}               
               // error={errors.description}
              />
              <HStack>
              <Input
                label="Valor"
                  type="number"
                  //@ts-ignore
                value={amount}
                  onChange={(e) => {
                  //@ts-ignore
                  setAmount(e.target.value);
                }}
               //error={errors.amount}
              />
              <Input
                label="Quantidade"
                type="qtde"
                {...register("qtde")}
                //error={errors.number_of_installments}
              />
               </HStack>
            </SimpleGrid>
          </VStack>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Valor</Th>
                <Th>Quantidade</Th>
               
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
                    <Text fontWeight="bold">{
                      //@ts-ignore
                      entry.amount}</Text>
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
                      (acc, item) => Number(acc) + Number(
                        //@ts-ignore
                        item.amount),
                      0,
                    )}
                  
                  </Th>
                  <Th></Th>
                </Tr>
              </Tfoot>
          </Table>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                colorScheme="purple"
                type="submit"
                isLoading={formState.isSubmitting}
              
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Adicionar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
