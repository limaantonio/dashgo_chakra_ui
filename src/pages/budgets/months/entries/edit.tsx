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
import { SideBar } from "../../../../components/SideBar";
import { Header } from "../../../../components/Header";
import { Input } from "../../../../components/Form/Input";
import  Select  from "../../../../components/Form/Select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form/dist/types";
import api from "../../../../services/api";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import {useRouter} from "next/router";


type CreateEntryFormData = {
  description: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
};

interface Balance {
  id: string;
  month: Number;
  created_at: Date;
  updated_at: Date;
}

interface Account {
  id: string;
  name: string;
  amount: Number;
  number_of_installments: Number;
  created_at: Date;
  updated_at: Date;
}

const createFormSchema = yup.object().shape({
  amount: yup.string().required("Valor obrigatório"),
});

export default function CreateBudget() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  });

  const router = useRouter()

  const errors = formState.errors;
  const { id } = router.query;

  const hangleCreateEntry: SubmitHandler<CreateEntryFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await api.put(`entry/${id}`, values);
    //@ts-ignore
    router.push(`/entries?id=${entries?.budget_month?.id}`);
  };

  const [accounts, setAccounts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [number_of_installments, setNumber_of_installments] = useState("");

  async function getAccounts(){
    await  api.get("accounts").then((response) => setAccounts(response.data));
  }

  async function getEntry() {
    await api.get(`entry/${id}`).then((response) => {
      setEntries(response.data)
      setDescription(response.data?.description);
      setAmount(response.data?.amount);
      setNumber_of_installments(response.data?.installment)
    });
      
  }

  useEffect(() => {
    getEntry()
    getAccounts()
  }, [id]);

  const toast = useToast();

  function transformDataAccountToOptions() {
    //@ts-ignore
    let selectAccount = []

    accounts?.map(
      (account) =>
        selectAccount.push({
          //@ts-ignore
          id: account.id,
          //@ts-ignore
          value: account.id,
          //@ts-ignore
          label: account.name
        })
    );
    //@ts-ignore
   return selectAccount
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box
          as="form"
          //@ts-ignore
          onSubmit={handleSubmit(hangleCreateEntry)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Editar Lançamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8" paddingY="6">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Select
                 //@ts-ignore
                placeholder={entries?.account?.name} label="Conta" options={transformDataAccountToOptions()} 
                 //@ts-ignore
                onChange={(e) => {
                   //@ts-ignore
                setAccount(e.target.value);
                }}
                 //@ts-ignore
              value={entries?.account?.name}/>
            </SimpleGrid>
          </VStack>
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Input
                label="Descrição"
                type="text"
                {...register("description")}
                //@ts-ignore
                error={errors.description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
              <Input
                label="Valor"
                type="number"
                {...register("amount")}
                //@ts-ignore
                error={errors.amount}
                onChange={(e) => {
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
                  setNumber_of_installments(e.target.value);
                }}
                value={number_of_installments}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/entries" passHref>
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
                    title: "Lançamento criado.",
                    description: "O lançamento foi criado com sucesso.",
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
