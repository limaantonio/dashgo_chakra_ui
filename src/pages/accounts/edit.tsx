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
    await api.put(`account/${id}`, values);
    router.push('/accounts')
  };

  const typeAccount = [
    { id: 1, value: "INCOME", label: "Receita" },
    { id: 2, value: "EXPENSE", label: "Despesa" },
  ];

  const sub_account = [
    { id: 1, value: "OTHER", label: "Outros" },
    { id: 2, value: "WAGE", label: "Salário" },
  ];

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account>();
 
  async function getBudget() {
    await api.get("budget").then((response) => setBudgets(response.data));
  }

  async function getAccount() {
    await api.get(`account/${id}`).then((response) => setAccounts(response.data));
  }

  function transformDataToOptions() {
    const selectBudget = [];
     budgets.map(
      (budget) =>
        (selectBudget.push({
          id: budget.id,
          value: budget.id,
          label: budget.year
        }),
    ));
    return selectBudget
  }

  useEffect(() => {
    getAccount()
    getBudget()
  }, [id]);

  const toast = useToast();
 
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
          p={["8", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Conta
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="6" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select
                label="Tipo"
                {...register("type")}
                placeholder="Selecione"
                options={typeAccount}
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.type}
              />

              <Select
                label="Sub-Conta"
                {...register("sub_account")}
                placeholder="Selecione"
                options={sub_account}
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.sub_account}
              />

              <Select
                label="Orçamento"
                {...register("budget_id")}
                placeholder="Selecione"
                options={transformDataToOptions()
                }
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.budget_id}
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
                {...register("name")}
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.name}
              />
              <Input
                label="Valor"
                type="number"
                {...register("amount")}
                error={errors.amount}
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.amount}
              />

              <Input
                label="Número de parcelas"
                type="number"
                {...register("number_of_installments")}
                error={errors.number_of_installments}
                onChange={(e) => {
                  setAccounts(e.target.value);
                }}
                value={accounts?.number_of_installments}
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
