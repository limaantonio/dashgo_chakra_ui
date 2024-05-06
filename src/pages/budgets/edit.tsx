import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

type CreateBudgetFormData = {
  year: Number;
};

interface Budget {
  id: string;
  year: Number;
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
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const [budget, setBudget] = useState<Budget>();

  useEffect(() => {
    api.get(`budget/${id}`).then((response) => setBudget(response.data));
  }, [id]);

  const handleEditBudget: SubmitHandler<CreateBudgetFormData> = async (
    values
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await api.put(`budget/${id}`, values);
    router.push("/budgets");
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
        <Box
          as="form"
          onSubmit={handleSubmit(handleEditBudget)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Orçamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={["6", "8"]} w="100%">
              <Input
                label="Ano"
                type="number"
                {...register("year")}
                onChange={(e) => {
                  setBudget(e.target.value);
                }}
                value={budget?.budget?.year}
                error={errors.name}
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
