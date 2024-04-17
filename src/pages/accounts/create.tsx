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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text
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
  wage = "WAGE",
	wage_bone = 'WAGE_BONUS',
	wage_extra = 'WAGE_EXTRA',
	wage_other = 'WAGE_OTHER',
	retirement = 'RETIREMENT',
	family_fund = 'FAMILY_FUND',
	investiment = 'INVESTIMENT',
	investiment_other = 'INVESTIMENT_OTHER',
	current_expenses = 'CURRENT_EXPENSES',
	current_expenses_other = 'CURRENT_EXPENSES_OTHER',
	interest_and_chages = 'INTEREST_AND_CHARGES',
  other = "OTHER",
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
  const { id } = router.query

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateBudget: SubmitHandler<CreateAccountFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const account = values
    account.budget_id = id
    const res = await api.post("account", account);
    if (res.status === 200) {
      router.push(`/accounts?id=${id}`)
     
    }
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

  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, []);

 
   function transformDataToOptions() {
    const selectBudget = [];
    budgets.map(
      (budget) =>
        (selectBudget.push({
          id: budget.budget.id,
          value: budget.budget.id,
          label: budget.budget.year
        }),
    ));
    return selectBudget
  }

  const toast = useToast();

  const format = (val) => `R$` + val
  const parse = (val) => val.replace(/^\$/, '')

  const [value, setValue] = useState(0.00)

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
              />

              <Select
                label="Sub-Conta"
                {...register("sub_account")}
                placeholder="Selecione"
                options={sub_account}
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
              />
            
            <Input
                label="Valor"
                type="text"
                {...register("amount")}
                error={errors.amount}
              />
              
              <Text>{id}</Text>
          
             
              <Input
                label="Número de parcelas"
                type="number"
                {...register("number_of_installments")}
                error={errors.number_of_installments}
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
                    title: "Conta criada.",
                    description: "A conta foi criado com sucesso.",
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
