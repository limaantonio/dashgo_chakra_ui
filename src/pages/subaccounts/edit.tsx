import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
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
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useToast } from "@chakra-ui/react";

enum AccountType {
  income = "INCOME",
  expanse = "EXPENSE",
}

enum SubAccountType {
  other = "OTHER",
  wage = "WAGE",
}

interface Account {	
  id: string; 
  name: string;
  amount: Number;
  type: AccountType;
  number_of_installments: Number;
  sub_account: SubAccountType;
}

type CreateAccountFormData = {
  name: string;
  amount: Number;
  type: AccountType;
  percentage: Number;
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
  const [subAccount, setSubAccount] = useState();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<AccountType>();
  const [percentage, setPercentage] = useState(0);
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });
  const errors = formState.errors;

  async function getSubAccount() {
    await api.get(`subaccount/${id}`).then((response) => {
      setName(response.data.name);
      setAmount(response.data.amount);
      setType(response.data.type);
      setPercentage(response.data.percentage);
    });
  }

  useEffect(() => {
    getSubAccount()
  }, []);

  const handleEditBudget: SubmitHandler<CreateAccountFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const data  = {
      name,
      amount,
      type,
      percentage,
    }
   
    await api.put(`subaccount/${id}`, data);
    router.push('/subaccounts')
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box
          as="form"
          //@ts-ignore
          onSubmit={handleSubmit(handleEditBudget)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["8", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Editar Conta
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="6" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
            
               <Input
                label="Nome"
                type="text"
                {...register("name")}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />

               <Input
                label="Tipo"
                type="text"
                {...register("type")}
                //error={errors.amount}
                onChange={(e) => {
                  //@ts-ignore
                  setType(e.target.value);
                }}
                value={type}
              />
              
            
            </SimpleGrid>
          </VStack>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
             
              <Input
                label="Valor"
                type="number"
                {...register("amount")}
                //@ts-ignore
                error={errors.amount}
                onChange={(e) => {
                  //@ts-ignore
                  setAmount(e.target.value);
                }}
                value={amount}
              />

              <Input
                label="Percentual"
                type="number"
                {...register("percentage")}
                //error={errors.number_of_installments}
                onChange={(e) => {
                  //@ts-ignore
                 setPercentage(e.target.value);
                }}
                value={percentage}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/accounts" passHref>
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
                    title: "Orçamento atualizado.",
                    description: "O orçamento foi atualizado com sucesso.",
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
      </Flex>
    </Box>
  );
}
