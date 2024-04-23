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
  
  FormLabel,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Text,
  Td,
  Paragraph,
} from "@chakra-ui/react";
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import {Checkbox} from "../../components/Form/Checkbox";
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
  month: Number;
  installment: Number;
}

enum AccountType {
  income = "INCOME",
  expanse = "EXPENSE",
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

  const typeAccount = [
    { id: 1, value: "INCOME", label: "Receita" },
    { id: 2, value: "EXPENSE", label: "Despesa" },
  ];
  

  const [items, setItems] = useState<Item[]>([])
  const [percentage, setPercentage] = useState<Number>(0.0);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("INCOME");
  const [income, setIncome] = useState<Number>(0.0);
  const [expense, setExpense] = useState<Number>(0.0);	
  const r = useRouter();
  const { id, budget_month } = r.query;


  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await api.post("subaccount", items);
    if (res && res.status === 200) {
      router.push(`/subaccounts`);
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
    
    const calculed_expense = incomeAmount * (percentage / 100) 

    let amount = 0.0

    if (type === 'INCOME') {
      amount = income
    } else {
      amount = calculed_expense
    }

    const principal = flagPrincipal == 1 ? true : false 
    
    const item = {
      name, 
      percentage,
      type,
      amount,
      principal
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
const [incomeAmount, setIncomeAmount] = useState(0.0);
const [flagPrincipal, setFlagPrincipal] = useState(0);

useEffect(() => {
  api.get(`account/budget/${id}`).then((response) => setAccounts(response.data));
}, []);

useEffect(() => {
  api.get('subaccount/balance').then((response) => setIncomeAmount(response.data.liquid_income));
}, []);


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
    <Box>
        
        <Box
          as="form"
          onSubmit={addItem} 
          flex="1"
          borderRightRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          
        >
          <Heading size="md" fontWeight="normal">
           Adicionar Classificação
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
             
              <HStack>
              
              <Input
                label="Nome"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
               // error={errors.amount}
              />
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
               </SimpleGrid>
              <Input
                label="Percentual"
                type="number"
                value={percentage}
                onChange={(e) => {
                  setPercentage(e.target.value);
                }}
                //error={errors.number_of_installments}
                isDisabled={type === 'EXPENSE' ? false : true}
              />
             
               <Input
                label="Valor"
                type="number"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value);
                }}
                isDisabled={type === 'INCOME' ? false : true}
                //error={errors.number_of_installments}
              />
               <Input
                label="Valor Disponivel"
                type="number"
                value={incomeAmount}
                onChange={(e) => {
                  setIncomeAmount(e.target.value);
                }}
                isDisabled={true}
                //error={errors.number_of_installments}
              />
               <Input
                label="Receita principal"
                type="number"
                value={flagPrincipal}
                onChange={(e) => {
                  setFlagPrincipal(e.target.value);
                }}
                isDisabled={type === 'EXPENSE' ? true : false}
               
                //error={errors.number_of_installments}
              />
              {/* <Box>
               <Checkbox label="Receitas lançadas" value={true} //continuar 
               />
               
               </Box> */}
               </HStack>
            </SimpleGrid>
            
          </VStack>
          <Box my="8">
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
                      <Text fontWeight="bold">{entry.percentage}%</Text>
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
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th></Th>
                <Th>{items.reduce((acc, item) => Number(acc) + Number(item.percentage), 0)}%</Th>
                <Th>{items.reduce((acc, item) => Number(acc) + Number(item.amount), 0)}</Th>
              </Tr>
            </Tfoot>
           
          </Table>
          </Box>
          
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
             
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
                onClick={() =>
                  hangleCreateEntry()
                }
                leftIcon={<RiSave2Fill />}
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
