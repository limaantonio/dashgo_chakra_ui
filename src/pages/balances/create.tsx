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
import { Select } from "../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../services/api";
import { useEffect, useState } from "react";

type CreateBalanceFormData = {
  month: Number;
};

interface Budget {
  id: string;
  year: Number;
  created_at: Date;
  updated_at: Date;
}

const createFormSchema = yup.object().shape({
  month: yup.string().required("Mês obrigatório"),
});

export default function CreateBalance() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const errors = formState.errors;

  const hangleCreateBalance: SubmitHandler<CreateBalanceFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.post("balance", values);
    console.log(values);
  };

  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, []);

  
  function transformDataToOptions() {
    const selectBudget = []
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

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />

        <Box
          as="form"
          onSubmit={handleSubmit(hangleCreateBalance)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Balanço
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select
                {...register("budget_id")}
                placeholder="Selecione"
                label="Orçamento"
                options
              ={transformDataToOptions()}/>
                
              <Input
                label="Mês"
                type="number"
                {...register("month")}
                error={errors.month}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/balances" passHref>
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
