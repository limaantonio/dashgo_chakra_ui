import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Icon,
  Td,
  Text,
  
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { Input } from "../../components/Form/Input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../services/api";
import { Tooltip } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import router from "next/router";
import { Select } from "../../components/Form/Select";
import { useState } from "react";
import { RiAddLine, RiDeleteBin6Line } from "react-icons/ri";

type CreateBudgetFormData = {
  year: Number;
};

interface Account {
  id: string;
  name: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}


const createFormSchema = yup.object().shape({
  year: yup.string().required("Ano obrigatório"),
});

export default function CreateBudget() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateBudget: SubmitHandler<CreateBudgetFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    let account;
    let budget = values; 

    const data = {
      accounts,
      budget 
    }

    console.log(data)

    await api.post("account", data);
    router.push("/budgets");
  };

  const typeAccount = [
    { id: 1, value: "INCOME", label: "Receita" },
    { id: 2, value: "EXPENSE", label: "Despesa" },
  ];
  
  const sub_account = [
    { id: 2, value: "WAGE", label: "Salário" },
    { id: 3, value: "WAGE_BONUS", label: "Salário Bônus" },
    { id: 4, value: "WAGE_EXTRA", label: "Salário Extra" },
    { id: 5, value: "WAGE_OTHER", label: "Salário Outros" },
    { id: 6, value: "RETIREMENT", label: "Aposentadoria" },
    { id: 7, value: "FAMILY_FUND", label: "Fundo Familiar" },
    { id: 8, value: "INVESTIMENT", label: "Investimento" },
    { id: 9, value: "INVESTIMENT_OTHER", label: "Investimento Outros" },
    { id: 10, value: "CURRENT_EXPENSES", label: "Despesas Correntes" },
    { id: 11, value: "CURRENT_EXPENSES_OTHER", label: "Despesas Correntes Outros" },
    { id: 12, value: "INTEREST_AND_CHARGES", label: "Juros e Tarifas" },
    { id: 13, value: "OTHER", label: "Outros" },
   
  ];

  const toast = useToast();

  const [accounts, setAccounts] = useState<Account[]>([])
  const [amount, setAmount] = useState<Number>(0);
  const [number_of_installments, setNumberOfInstallments] = useState<Number>(0);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [subaccount, setSubAccount] = useState<string>("");

  function addItem(e: Event) {
    e.preventDefault()
    const item = {
      name, 
      amount,
      number_of_installments,
      sub_account: subaccount,
      type: type

    }
    setAccounts([...accounts, item])
    
  }

  async function handleDelete(id: string) {
 
    const itemIndex = accounts.findIndex((b) => b.id === id);
    const item = [...accounts];
  
    item.splice(itemIndex, 1);
    setAccounts(item);
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        

        <Box
          as="form"
          onSubmit={handleSubmit(hangleCreateBudget)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Orçamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="6" paddingY="6">
          <Input
                label="Ano"
                type="text"
                {...register("year")}
                error={errors.year}
              />
           
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/budgets" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>

              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                onClick={() =>
                  toast({
                    title: "Orçamento criado.",
                    description: "O orçamento foi criado com sucesso.",
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
              <Select
                label="Tipo"
                placeholder="Selecione"
                options={typeAccount}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />

              <Select
                label="Sub-Conta"
                placeholder="Selecione"
                options={sub_account}
                value={subaccount}
                onChange={(e) => {
                  setSubAccount(e.target.value);
                }}
              />

            </SimpleGrid>
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
                label="Parcelas"
                type="qtde"
                value={number_of_installments}
                onChange={(e) => {
                  setNumberOfInstallments(e.target.value);
                }}
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
                <Th>Tipo</Th>
                <Th>Sub-Conta</Th>
               
              </Tr>
            </Thead>
            <Tbody>
              {accounts.map((entry) => (
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
                      <Text fontWeight="bold">{entry.type}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">{entry.sub_account}</Text>
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
