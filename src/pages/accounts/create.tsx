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
    const res = await api.post(`account/budget/${id}`, account);
    if (res.status === 200) {
      router.push(`/accounts?id=${id}`)
     
    }
  };

  
  const [budgets, setBudgets] = useState<Budget[]>([]);


  useEffect(() => {
    api.get("budget").then((response) => setBudgets(response.data));
  }, []);

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
    setSubAccount(subAccount.type);
    
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
              {/* <Select
                label="Tipo"
                {...register("type")}
                placeholder="Selecione"
                options={typeAccount}
              /> */}

              <Select
                label="Sub-Conta"
                {...register("sub_account_id")}
                onChange={(e) => selectionSubAccount(e.target.value)}
                placeholder="Selecione"
                options={transformDataToOptions()}
              />

              <Input
                label="Tipo"
                type="text"
                value={subAccount}
                isDisabled={true}
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
