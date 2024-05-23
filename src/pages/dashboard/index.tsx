import { Flex, Box, SimpleGrid, Text, theme, color, Heading, Button, Icon,   Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList, 
  HStack} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import api from '../../services/api'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { RiAddLine, RiArrowDownSFill } from 'react-icons/ri'
import Select from '../../components/Form/Select'
import { set } from 'date-fns'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type AccountType = "INCOME" | "EXPENSE";

interface Account {
  id: string;
  name: string;
  type: AccountType;
  amount: Number;
  sub_account: Account;
}

interface Budget {
  id: string;
  year: Number;
  month: Number;
  entry: {
    account: Account;
    items: {
      amount: Number;
    }[];
  }[];
}

export default function Dashboard() {
  // const router = useRouter()

  // const checkAuth = () => {
  //   const userToken = localStorage.getItem('user')
  //   if (userToken == 'undefined' || userToken == 'null' || userToken == '') {
  //     router.push('/')
  //   }
  // }

  // useEffect(() => {
  //   checkAuth()
  // }, [])

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

 
 async function loadBudgets() {
    await api.get(`budget/user/${user}`).then((response) => setBudgets(response.data))
  }

  const [user, setUser] = useState(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [subAccount, setSubAccount] = useState([])
  const [budget, setBudget] = useState()
  const [year, setYear] = useState()

  useEffect(() => {
    const userId = getFromLocalStorage('user')
    if (userId) {
      setUser(userId) 
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadBudgets()
    }
  
  }, [user])

  useEffect(() => {
    if (budgets.length > 0) {
      const lastBudget = budgets[budgets.length - 1];
        //@ts-ignore
        setBudget(lastBudget);
    }
  }, [budgets]);

  useEffect(() => {
    if (budget) {
      loadSubAccounts();
    }
  }, [budget]);

  async function loadSubAccounts() {
     //@ts-ignore
    await api.get(`subaccount/budget/${budget?.budget?.id}`).then((response) => {
      setSubAccount(response.data)
    })   
  }


  let months = [
    { month: 'Jan', income: 0, expanse: 0 },
    { month: 'Fev', income: 0, expanse: 0 },
    { month: 'Mar', income: 0, expanse: 0 },
    { month: 'Abr', income: 0, expanse: 0 },
    { month: 'Mai', income: 0, expanse: 0 },
    { month: 'Jun', income: 0, expanse: 0 },
    { month: 'Jul', income: 0, expanse: 0 },
    { month: 'Ago', income: 0, expanse: 0 },
    { month: 'Set', income: 0, expanse: 0 },
    { month: 'Out', income: 0, expanse: 0 },
    { month: 'Nov', income: 0, expanse: 0 },
    { month: 'Dez', income: 0, expanse: 0 },
  ]

  const data: { name: any; value: string }[] = []



  let total = 0

  subAccount?.filter((sub) => {
     //@ts-ignore
    if (sub.type === 'EXPENSE') {
       //@ts-ignore
      total += Number(sub.amount)
    }
  })

  subAccount.map((sub) => {
     //@ts-ignore
    if (sub.type === 'EXPENSE') {
      data.push({
         //@ts-ignore
        name: sub.name,
         //@ts-ignore
        value: ((Number(sub.amount) / total) * 100).toFixed(2),
      })
    }
  })

  const e = data.map((item) => Number(item.value))
  const b = data.map((item) => item.name)

  const options_demostrativo = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: [theme.colors.red[500], theme.colors.green[500]],
    fill: {
      type: 'solid',
      opacity: 0.4,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',

      y: {
        formatter: function (
           //@ts-ignore
          val) {
          return Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(val)
        },
      },
    },
    xaxis: {
      type: 'string',
      axisBorder: {
        color: theme.colors.gray[600],
      },
      axisTicks: {
        color: theme.colors.gray[600],
      },
      categories: months.map((month) => month.month),
    },
  }

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    fill: {
      type: 'solid',
    },

    labels: b,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'bottom',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 0,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: function (
           //@ts-ignore
          val) {
          return val + '%'
        },
      },
    },
  }

     //@ts-ignore
    budget?.budget?.budget_months?.map((month) => {
       //@ts-ignore
      month?.entry.map((entry) => {
        entry.items.map((
          //@ts-ignore
          item) => {    
          
          if (
            //@ts-ignore
            month.month === 1) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[0].income += Number(item.amount)
            } else {
              months[0].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 2) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[1].income += Number(item.amount)
            } else {
              months[1].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 3) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[2].income += Number(item.amount)
            } else {
              months[2].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 4) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[3].income += Number(item.amount)
            } else {
              months[3].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 5) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[4].income += Number(item.amount)
            } else {
              months[4].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 6) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[5].income += Number(item.amount)
            } else {
              months[5].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 7) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[6].income += Number(item.amount)
            } else {
              months[6].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 8) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[7].income += Number(item.amount)
            } else {
              months[7].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 9) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[8].income += Number(item.amount)
            } else {
              months[8].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 10) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[9].income += Number(item.amount)
            } else {
              months[9].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 11) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[10].income += Number(item.amount)
            } else {
              months[10].expanse += Number(item.amount)
            }
          }

          if (
            //@ts-ignore
            month.month === 12) {
            if (entry.account.sub_account.type === 'INCOME') {
              months[11].income += Number(item.amount)
            } else {
              months[11].expanse += Number(item.amount)
            }
          }
      })
    })
  })

  const series_demontrativo = [
    {
      name: 'Despesas',
      data: months.map((month) => month.expanse),
    },
    {
      name: 'Receitas',
      data: months.map((month) => month.income),
    },
  ]

  const [subAccounts, setSubAccounts] = useState<Account[]>([]);

  return (
    <Flex direction="column" h="100vh">
      <Header value={`Contas de ${
        //@ts-ignore
        budget?.budget?.year}`} budgets={budgets} />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
         <Box flex="1">
          <Flex mb="8" justify="space-between" align="center">
            
            <HStack>
             
      
             <Menu>
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
              </Menu>
          
              </HStack>
            </Flex>
        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Demonstrativo
            </Text>
            <Chart
              type="bar"
              width={"100%"}
              
               //@ts-ignore
              options={options_demostrativo}
              series={series_demontrativo}
            />
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Disbruição de gastos
            </Text>
          
            <Chart type="donut" 
             //@ts-ignore
              options={options} series={e}
              width={"100%"}
            />
          </Box>
          </SimpleGrid>
          </Box>
      </Flex>
    </Flex>
  )
}
