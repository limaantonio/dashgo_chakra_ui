import { Flex, Button, useToast, Box, VStack, Text, Link } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { Input } from '../../components/Form/Input'
import api from '../../services/api'
import Image from 'next/image'
const logo = require('../../assets/logo.png')

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const toast = useToast()
  const router = useRouter()

  //@ts-ignore
  const onSubmit = async (data) => {
    try {
      const response = await api.post('/register', data)
      localStorage.setItem('user', JSON.stringify(response.data.user.id))
      localStorage.setItem('token', JSON.stringify(response.data.token))
      router.push(`/dashboard`)
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          'Falha ao fazer login. Por favor, verifique suas credenciais.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
   <Flex align="center" justify="center" h="100vh" >
      <VStack spacing={12}   bg="gray.800"  w="30%" p={8} rounded={8} maxW="400px">
      
        <Image src={logo} alt="logo" width={150} height={150} />
        
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
          direction="column"
        
          
        >
       
        <Input
          label="Nome"
          type="text"
          {...register('name')}
          //@ts-ignore
          error={errors.name}
        />
         
          <Input
            
          label="Usuário"
          type="email"
          {...register('email')}
          //@ts-ignore
          error={errors.email}
        />
        <Input
          label="Senha"
          type="password"
          {...register('password')}
          //@ts-ignore
          error={errors.password}
            />
            
          
        <Button
          type="submit"
          colorScheme="green"
          mt={4}
          isLoading={isSubmitting}
        >
          Cadastrar
          </Button>
         
        </Flex>
         <Link href="/login">
            <Text >Entrar</Text>
          </Link>
         </VStack>
    </Flex>
  )
}