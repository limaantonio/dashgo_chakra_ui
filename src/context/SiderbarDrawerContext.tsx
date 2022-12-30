import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import exp from "constants";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface SideBarDrawerProviderProps {
  children: ReactNode;
}

type SiderBarDrawerContextData = UseDisclosureReturn;

const SideBarDrawerContext = createContext({} as SiderBarDrawerContextData);

export function SideBarDrawerProvider({
  children,
}: SideBarDrawerProviderProps) {
  const dsclosure = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    dsclosure.onClose();
  }, [router.asPath]);

  return (
    <SideBarDrawerContext.Provider value={dsclosure}>
      {children}
    </SideBarDrawerContext.Provider>
  );
}

export const useSideBarDrawer = () => useContext(SideBarDrawerContext);
