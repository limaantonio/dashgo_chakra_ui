import {
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
    Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList, 
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSideBarDrawer } from "../../context/SiderbarDrawerContext";
import { NotificationNav } from "../Header/NotificationNav";
import { Profile } from "../Header/Profile";
// import { SeachBox } from "../Header/SeachBox";
import { RiArrowDownSFill, RiMenuLine } from "react-icons/ri";
import Image from 'next/image'
import { Logo } from "./Logo";
import { SeachBox } from "./SeachBox";
import { useState } from "react";
const logo = require('../../assets/logo.png')

export function Header({
  value = '',
  budgets = ''
}) {
  const { onOpen } = useSideBarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [budget, setBudget] = useState()

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      marginX="auto"
      alignItems="center"
      mt="4"
      px="4"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          fontSize="24"
          onClick={onOpen}
          alignItems="center"
          h="10"
          w="10"
          bg="gray.800"
          _hover={{ bg: "gray.900" }}
          mr="2"
          icon={<Icon as={RiMenuLine} />}
        ></IconButton>
      )}

      <Logo />



      {isWideVersion && <SeachBox value={value} />}

       {/* <Menu>
                  <MenuButton
                    bg="gray.700"
                    as={Button}
                    mr="4"
                    rightIcon={<RiArrowDownSFill />}
                  >
                    Ano
                  </MenuButton>
                  <MenuList textColor="black">
                    <MenuGroup title="Orçamentos">
                      {budgets.map((b) => (
                        <MenuItem
                          as="button"
                          bg={
                            //@ts-ignore
                            b.budget.id === budget ? 'green.400' : 'white'}
                          textColor={
                              //@ts-ignore
                            b.budget.id === budget ? 'white' : 'black'}
                          _hover={{ bg: 'gray.50' }}
                          key={
                              //@ts-ignore
                            b.budget.id}
                          value={
                              //@ts-ignore
                            b.budget.year}
                          onClick={() => {
                            //@ts-ignore
                            setBudget(b)
                            localStorage.setItem('budget', JSON.stringify(
                                //@ts-ignore
                              b.budget.id))
                          }}
                        >
                          {
                              //@ts-ignore
                            b.budget.year}
                        </MenuItem>
                      ))}
                      <MenuItem
                        bg="gray.50"
                        onClick={() => {
                          //@ts-ignore
                          setBudget('')
                        }}
                        as="button"
                      >
                        Limpar filtro
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
              </Menu> */}
      <Flex align="center" ml="auto">
        
        {/* <NotificationNav /> */}
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}
