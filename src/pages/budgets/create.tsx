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
import { useEffect } from "react";
import { set } from "date-fns";

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

    const y = values.year;

    const data = {
      accounts,
      budget :{
        year: y,
      } 
    }

    console.log(data)

    const response = await api.post("account", data);
    if (response.status === 200) {
      toast({
        title: "Orçamento criado.",
        description: "Orçamento criado com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      router.push("/budgets");
    } else {
       toast({
        title: "Erro ao criar lançamento. Saldo insulficiente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    
  };

  const toast = useToast();
  const [accounts, setAccounts] = useState<Account[]>([])
  const [amount, setAmount] = useState<Number>(0);
  const [number_of_installments, setNumberOfInstallments] = useState<Number>(0);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [availableAmount, setAvailableAmount] = useState<Number>(0);
  const [dotacao, setDotacao] = useState<Number>(0);
  
  function addItem(e: Event) {
    e.preventDefault()
    const item = {
      name, 
      amount,
      number_of_installments,
      sub_account_id: subAccount?.id,
      sub_account: subAccount?.name,
      type: subAccount?.type,

    }
    if (amount > availableAmount) {
      toast({
        title: "Erro ao adicionar item. Saldo insulficiente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setAccounts([...accounts, item])
      setName("");
      setAmount(0);
      setNumberOfInstallments(0);
      handleChangeAvailableAmount();
      setSubAccount("");
    
      
      toast({
        title: "Item adicionado.",
        description: "O item foi adicionado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    
  }

  async function handleDelete(id: string) {
 
    const itemIndex = accounts.findIndex((b) => b.id === id);
    const item = [...accounts];
  
    item.splice(itemIndex, 1);
    setAccounts(item);
  }

  useEffect(() => {
    api.get("subaccount").then((response) => setSubAccounts(response.data));
    
  }, []);

  const [subAccounts, setSubAccounts] = useState<Account[]>([]);
  const [subAccount, setSubAccount] = useState();
 
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
    setSubAccount(subAccount);
    setType(subAccount.type);
    setDotacao(subAccount.amount);
    let used_value = 0;

    if (accounts.length > 0) {
   
      accounts?.map((account) => {
        console.log(account.sub_account)
        console.log(subAccount.name)
        if (account.sub_account == subAccount?.name) {
          used_value += Number(account.amount);
        }
      });
    }

    console.log(used_value)
    console.log(subAccount?.amount)
    
    setAvailableAmount(subAccount?.amount - used_value);
    
    
   
    
  }

  function handleChangeAvailableAmount() {
    let used_value = 0;

    if (accounts.length > 0) {
   
      accounts?.map((account) => {
        //console.log(account.sub_account)
        //console.log(subAccount.name)
        if (account.sub_account == subAccount?.name) {
          used_value += Number(account.amount);
        }
      });
    }

    console.log(used_value)
    console.log(subAccount?.amount)
    
    setAvailableAmount(subAccount?.amount - used_value);
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
                label="Sub-Conta"
                //{...register("sub_account_id")}
                value={subAccount?.id ? subAccount?.id : ""}
                onChange={(e) => selectionSubAccount(e.target.value)}
                placeholder="Selecione"
              
                options={transformDataToOptions()}
              />

              <Input
                label="Tipo"
                type="text"
                value={type}
                isDisabled={true}
              />

              <Input
                label="Dotação"
                type="text"
                value={dotacao}
                isDisabled={true}
              />

              <Input
                label="Disponivel"
                type="text"
                value={availableAmount}
                isDisabled={true}
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
                <Th>Parcelas</Th>
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
