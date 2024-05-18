import { useEffect, useState } from 'react'
import api from '../../services/api'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  HStack,
  Tbody,
  Td,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  Avatar,
} from '@chakra-ui/react'
import {
  RiAddLine,
  RiArrowDownSFill,
  RiDeleteBin6Line,
  RiPencilLine,
  RiLogoutBoxFill,
  RiAccountCircleLine,
} from 'react-icons/ri'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const [user, setUser] = useState()
  const [id, setId] = useState()

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

  useEffect(() => {
    const userId = getFromLocalStorage('user')
    if (userId) {
      setId(userId)
    }
  }, [])

  // UseEffect para buscar o usuário quando o ID do usuário for alterado
  useEffect(() => {
    if (id) {
      getUser()
    }
  }, [id])

  // Função para buscar os dados do usuário na API
  async function getUser() {
    try {
      const response = await api.get(`/user/${id}`)
      setUser(response.data)
    } catch (error) {
      console.error('Erro ao obter usuário:', error)
    }
  }

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          
          <Text>{
            //@ts-ignore
            user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {
              //@ts-ignore
              user?.email}
          </Text>
        </Box>
      )}
      <Box>
        <Menu>
          <Avatar
            as={MenuButton}
            size="md"
            
            name={
              //@ts-ignore
              user?.name}
            src="https://github.com/limaantonio.png"
          />
          <MenuList>
            <MenuItem icon={<RiAccountCircleLine />} color="gray.600" >
              Perfil
            </MenuItem>
            <MenuItem
              icon={<RiLogoutBoxFill />}
              color="gray.600"
              as="button"
              onClick={() => {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                window.location.href = '/login'
              }}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  )
}
