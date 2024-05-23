import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  FormLabel,
} from "@chakra-ui/react";
import { SideBar } from "../../../components/SideBar";
import { Header } from "../../../components/Header";
import { Input } from "../../../components/Form/Input";
import  Select  from "../../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../../services/api";
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

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;
  const { id } = router.query;

  const hangleCreateBudget: SubmitHandler<CreateAccountFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = {
      name: values.name,
      amount: values.amount,
      type: values.type,
      number_of_installments: values.number_of_installments,
      sub_account_id: subAccount,
    }
    await api.put(`account/${id}`, data);
     //@ts-ignore
    router.push(`/accounts?id=${accounts?.budget_id}`)
  };

  const [subAccounts, setSubAccounts] = useState();
  const [subAccount, setSubAccount] = useState();
  const [accounts, setAccounts] = useState<Account>();
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [number_of_installments, setNumber_of_installments] = useState();
 
  async function getBudget() {
    await api.get("subaccount").then((response) => setSubAccounts(response.data));
  }

  async function getAccount() {
    await api.get(`accountid/${id}`).then((response) => {
      setAccounts(response.data)
      setName((response.data?.name))
      setAmount(response.data?.amount)
      setNumber_of_installments(response.data?.number_of_installments);
    });

  }

  function transformDataToOptions() {
     //@ts-ignore
    const selectBudget = [];
     //@ts-ignore
    subAccounts.map(
      //@ts-ignore
      (budget) =>
        selectBudget.push({
          id: budget.id,
          value: budget.id,
          label: budget.name
        })
    );
     //@ts-ignore
    return selectBudget
  }

  useEffect(() => {
    getAccount()
    getBudget()
  }, []);

  const toast = useToast();
 
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box
          as="form"
           //@ts-ignore
          onSubmit={handleSubmit(hangleCreateBudget)}
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
              
              <Select
                label="Sub-Conta"
                {...register("sub_account")}
                 //@ts-ignore
                placeholder="Selecione"
                 //@ts-ignore
                options={subAccounts?.map((subAccount) => ({ value: subAccount.id, label: subAccount.name }))}
                 //@ts-ignore
                onChange={(e) => {
                   //@ts-ignore
                  setSubAccount(e.target.value);
                }}
                value={subAccount}
              />

               <Input
                label="Nome"
                type="text"
                {...register("name")}
                 //@ts-ignore
                error={errors.name}
                {...register("name")}
                onChange={(e) => {
                   //@ts-ignore
                  setName(e.target.value);
                }}
                value={name}
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
                label="Número de parcelas"
                type="number"
                {...register("number_of_installments")}
                 //@ts-ignore
                error={errors.number_of_installments}
                onChange={(e) => {
                   //@ts-ignore
                  setNumber_of_installments(e.target.value);
                }}
                value={number_of_installments}
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
