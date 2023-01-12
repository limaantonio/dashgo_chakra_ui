import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Icon,
} from "@chakra-ui/react";
import { RiArrowDownSFill } from "react-icons/ri";

export default function Filter({ balances, balance, getByMonth }) {
  return (
    <>
      <Menu>
        <MenuButton
          bg="blue.400"
          as={Button}
          mr="4"
          rightIcon={<RiArrowDownSFill />}
        >
          Filtrar
        </MenuButton>
        <MenuList textColor="black">
          <MenuGroup title="Balanço">
            {balances.map((balance) => (
              <MenuItem
                as="button"
                onClick={() => {
                  getByMonth(balance.id);
                }}
                key={balance.id}
              >
                {balance.month}
              </MenuItem>
            ))}
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
}
