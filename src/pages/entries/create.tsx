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
  Paragraph,
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
import { useRouter } from "next/router";
import { RiAddLine, RiArrowLeftLine, RiDeleteBin6Line, RiPencilLine, RiSave2Fill } from "react-icons/ri";

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
  installment: Number;
  budget_month_id: string;
}

const createFormSchema = yup.object().shape({
  description: yup.string().required("Valor obrigatório"),
});

const status = [{
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
  const r = useRouter();
  const { id, budget_month } = r.query;

  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // setEntry(values);
    // console.log(entry);
    const entry = values
    
    entry.budget_month_id = budget_month

    const data = {
      entry,
      items
    }
    
    const res = await api.post("item", data);
    if (res) {
      router.push(`/entries?id=${data.entry.budget_month_id}`);
    } else {
      toast({
        title: "Erro ao criar lançamento.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  function addItem(e: Event) {
    e.preventDefault()
    const item = {
      name, 
      amount
    }
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

  useEffect(() => {
    api.get(`account/budget/${id}`).then((response) => setAccounts(response.data));
  }, []);

function transformDataAccountToOptions() {
  let selectAccount = []

  accounts?.map(
    (account) =>
      (selectAccount.push({
        id: account.account.id,
        value: account.account.id,
        label: account.account.name
      }),
  ));
  return selectAccount
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
              <HStack>
              <Input
                label="Parcela"
                type="number"
                {...register("installment")}
               // error={errors.month}
              />
              <Select
                label="Status"
                {...register("status")}
                placeholder="Selecione"
                options={status}
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
                onClick={() =>
                  toast({
                    title: "Lançamento criado.",
                    description: "O lançamento foi criado com sucesso.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  })
                }
                leftIcon={<RiSave2Fill />}
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
                }}
               
               // error={errors.description}
              />
              <HStack>

             
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
               </HStack>
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
              <Button
                colorScheme="purple"
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
