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
  
  FormLabel,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Checkbox,
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
import { useToast } from "@chakra-ui/react";
import router from "next/router";
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";

type CreateEntryFormData = {
  description: string;
  installment: Number;
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
  name: string;
  qtde: Number;
  account: Account;
  entry: Entry;
}

interface Entry {
  id: string; 
  description: string;
  month: Number;
  installment: Number;
}

const createFormSchema = yup.object().shape({
  description: yup.string().required("Valor obrigatório"),
});

export default function CreateBudget() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const [items, setItems] = useState<Item[]>([])
  const [amount, setAmount] = useState<Number>(0);
  const [name, setName] = useState<string>("");

  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // setEntry(values);
    // console.log(entry);
    const entry = values

    const data = {
      items,
      entry
    }
    console.log(data)
    
    await api.post("item", data);
    router.push(`/accounts`);
  };

  function addItem(e: Event) {
    e.preventDefault()
    const item = {
      name, 
      amount
    }

    setItems([...items, item])
    console.log(items)
  }


  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    api.get("account").then((response) => setAccounts(response.data));
  }, []);

 function transformDataAccountToOptions() {
  let selectAccount = []

  accounts.map(
    (account) =>
      (selectAccount.push({
        id: account.account.id,
        value: account.account.id,
        label: account.account.name
      }),
  ));
  return selectAccount
}

async function handleDelete(id: string) {
 
  const itemIndex = items.findIndex((b) => b.id === id);
  const item = [...items];

  item.splice(itemIndex, 1);
  setItems(item);
}

const toast = useToast();

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box
          as="form"
          onSubmit={handleSubmit(hangleCreateEntry)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Lançamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select {...register("account_id")} placeholder="Selecione" label="Conta" options={transformDataAccountToOptions()}/>
            </SimpleGrid>
          </VStack>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Input
                label="Descrição"
                type="text"
                {...register("description")}
      //error={errors.description}
              />
              <Input
                label="Parcela"
                type="number"
                {...register("month")}
               // error={errors.month}
              />
              <Input
                label="Mês"
                type="number"
                {...register("number_of_installments")}
               // error={errors.number_of_installments}
              />
            </SimpleGrid>
          
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
             
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                onClick={() =>
                  toast({
                    title: "Lançamento criado.",
                    description: "O lançamento foi criado com sucesso.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  })
                }
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
        
        <Box
          as="form"
          onSubmit={addItem} 
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
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
                }}
               
               // error={errors.description}
              />
              <Input
                label="Valor"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
               // error={errors.amount}
              />
              <Input
                label="Quantidade"
                type="qtde"
                {...register("qtde")}
                //error={errors.number_of_installments}
              />
            </SimpleGrid>
          </VStack>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Valor</Th>
                <Th>Mês</Th>
               
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
          </Table>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/entries" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Voltar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                onClick={() =>
                  toast({
                    title: "Item adicionado.",
                    description: "O item foi adicionado com sucesso.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  })
                }
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
