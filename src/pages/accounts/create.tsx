import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
  Select,
  FormLabel,
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

enum AccountType {
  income = "INCOME",
  expanse = "EXPENSE",
}

enum SubAccountType {
  other = "OTHER",
  wage = "WAGE",
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
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateBudget: SubmitHandler<CreateAccountFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.post("account", values);
    console.log(values);
  };

  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, []);

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
            Criar Conta
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select {...register("type")} placeholder="Selecione">
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </Select>
              <Select {...register("sub_account")} placeholder="Selecione">
                <option value="WAGE">Salário</option>
                <option value="OTHER">Outro</option>
              </Select>
              <Select {...register("budget_id")} placeholder="Selecione">
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.year}
                  </option>
                ))}
              </Select>
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
                type="number"
                {...register("amount")}
                error={errors.amount}
              />
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
              <Link href="/budgets" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formState.isSubmitting}
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
