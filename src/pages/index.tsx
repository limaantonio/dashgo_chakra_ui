import { Flex, Button, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";

type SingInFormData = {
  email: string;
  password: string;
};

const singInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SingIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(singInFormSchema),
  });

  const errors = formState.errors;

  const hangleSignIn: SubmitHandler<SingInFormData> = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(values);
    console.log(errors);
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Flex
        as="form"
        w="100%"
        maxWidth={360}
        bg="gray.800"
        p={8}
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(hangleSignIn)}
      >
        <Stack spacing="4">
          <Input
            type="email"
            label="E-mail"
            {...register("email")}
            error={errors.email}
          />
          <Input
            type="password"
            label="Senha"
            {...register("password")}
            error={errors.password}
          />
        </Stack>
        <Link href="/dashboard" passHref>
          <Button
            as="a"
            mt="6"
            colorScheme="green"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
