import {
  Box,
  Divider,
  Flex,
  Heading,
  VStack,
  SimpleGrid,
  HStack,
  Button,
} from '@chakra-ui/react'
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import { Input } from '../../components/Form/Input'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler } from 'react-hook-form/dist/types'
import api from '../../services/api'
import { Tooltip } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import router from 'next/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type CreateBudgetFormData = {
  year: Number
}

const createFormSchema = yup.object().shape({
  year: yup.string().required('Ano obrigatório'),
})

export default function CreateBudget() {
  const r = useRouter()
  const { id } = r.query

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createFormSchema),
  })

  const errors = formState.errors

  const hangleCreateBudget: SubmitHandler<CreateBudgetFormData> = async (
    values,
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = {
      year: values.year,
      user_id: user,
    }
    try {
      await api.post('budget', data)
   
      toast({
        title: 'Orçamento criado.',
        description: 'O orçamento foi criado com sucesso.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

      router.push(`/budgets`)
                
    } catch (error) {
      toast({
        title: 'Erro ao criar orçamento.',
        description: `${(error as any).response.data.Error}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

   //@ts-ignore
  const getFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error)
      return null
    }
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getFromLocalStorage('user'))
  }, [])

  const toast = useToast()

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
          p={['6', '8']}
        >
          <Heading size="lg" fontWeight="normal">
            Criar Orçamento
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="248px" spacing={['6', '8']} w="100%">
              <Input
                label="Ano"
                type="number"
                {...register('year')}
                 //@ts-ignore
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
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
