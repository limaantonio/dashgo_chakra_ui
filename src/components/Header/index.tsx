import {
  Flex,
  Icon,
  IconButton,
  useBreakpoint,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSideBarDrawer } from "../../context/SiderbarDrawerContext";
import { Logo } from "../Header/Logo";
import { NotificationNav } from "../Header/NotificationNav";
import { Profile } from "../Header/Profile";
import { SeachBox } from "../Header/SeachBox";
import { RiMenuLine } from "react-icons/ri";

export function Header() {
  const { onOpen } = useSideBarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      marginX="auto"
      mt="4"
      px="24"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
          icon={<Icon as={RiMenuLine} />}
        ></IconButton>
      )}
      <Logo />
      {isWideVersion && <SeachBox />}
      <Flex align="center" ml="auto">
        <NotificationNav />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}
