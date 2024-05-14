import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { AuthProvider } from '../context/AuthProvider'
import { SideBarDrawerProvider } from '../context/SiderbarDrawerContext'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {/* Envolve o componente raiz com os provedores de contexto */}
      <AuthProvider>
        <SideBarDrawerProvider>
          <Component {...pageProps} />
        </SideBarDrawerProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
