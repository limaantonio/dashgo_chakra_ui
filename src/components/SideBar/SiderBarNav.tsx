import { Stack } from '@chakra-ui/react'
import { NavLink } from './NavLink'
import { NavSection } from './NavSection'
import {
  RiDashboardLine,
  RiMoneyDollarBoxFill,
  RiCurrencyLine,
  RiInputMethodLine,
  RiAddFill,
  RiGitMergeLine,
  RiFileListLine,
  RiFileList2Line,
} from 'react-icons/ri'

export function SideBarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
        <NavLink icon={RiMoneyDollarBoxFill} href="/budgets">
          Orçamentos
        </NavLink>
        <NavLink icon={ RiFileList2Line} href="/subaccounts">
          Planejamento de gastos
        </NavLink>
        {/* <NavLink icon={RiMoneyDollarBoxFill} href="/accounts">
          Contas
        </NavLink>
        <NavLink icon={RiMoneyDollarBoxFill} href="/months">
          Orçamento mensal
        </NavLink>
        <NavLink icon={RiMoneyDollarBoxFill} href="/entries">
          Lançamentos
        </NavLink> */}
      </NavSection>
      <NavSection title="INVESTIMENTO">
        <NavLink icon={RiInputMethodLine} href="/forms">
          Formulários
        </NavLink>
        <NavLink icon={RiGitMergeLine} href="/automation">
          Automação
        </NavLink>
      </NavSection>
    </Stack>
  )
}
