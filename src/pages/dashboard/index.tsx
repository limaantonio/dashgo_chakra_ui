import { Flex, Box, SimpleGrid, Text, theme, color } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { SideBar } from '../../components/SideBar'
import { Header } from '../../components/Header'
import api from '../../services/api'
import { useEffect, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

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

  const [budgets, setBudgets] = useState([])
  const [subAccount, setSubAccount] = useState([])

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

  useEffect(() => {
    api.get('subaccount').then((response) => {
      setSubAccount(response.data)
    })
  }, [])

  let total = 0

  subAccount.filter((sub) => {
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

  useEffect(() => {
    api.get('budget').then((response) => {
      setBudgets(response.data[0]?.budget.budget_months)
    })
  }, [setBudgets])

  budgets?.map((budget) => {
     //@ts-ignore
    budget.entry.map((entry) => {
      entry.items.map((
         //@ts-ignore
        item) => {
        let amount = 0
        if (
           //@ts-ignore
          budget.month === 1) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[0].income += Number(item.amount)
          } else {
            months[0].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 2) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[1].income += Number(item.amount)
          } else {
            months[1].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 3) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[2].income += Number(item.amount)
          } else {
            months[2].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 4) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[3].income += Number(item.amount)
          } else {
            months[3].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 5) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[4].income += Number(item.amount)
          } else {
            months[4].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 6) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[5].income += Number(item.amount)
          } else {
            months[5].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 7) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[6].income += Number(item.amount)
          } else {
            months[6].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 8) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[7].income += Number(item.amount)
          } else {
            months[7].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 9) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[8].income += Number(item.amount)
          } else {
            months[8].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 10) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[9].income += Number(item.amount)
          } else {
            months[9].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 11) {
          if (entry.account.sub_account.type === 'INCOME') {
            months[10].income += Number(item.amount)
          } else {
            months[10].expanse += Number(item.amount)
          }
        }

        if (
           //@ts-ignore
          budget.month === 12) {
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

  //Demonstrativo do que foi gasto e por categoria
  // const series = subAccount.map((sub) => {
  //   let total = 0
  //   budgets.map((budget) => {
  //     budget.entry.map((entry) => {
  //       entry.items.map((item) => {
  //         if (entry.account.sub_account.name === sub.name) {
  //           total += Number(item.amount)
  //         }
  //       })
  //     })
  //   })
  //   return total
  // })

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SideBar />
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
              height={220}
               //@ts-ignore
              options={options_demostrativo}
              series={series_demontrativo}
            />
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Disbruição de gastos
            </Text>
          
            <Chart type="donut" height={270}
             //@ts-ignore
              options={options} series={e}
              width={"100%"}
            />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
