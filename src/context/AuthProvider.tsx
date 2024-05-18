import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'

interface AuthContextData {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const login = () => {
    // Lógica para realizar o login
    setIsAuthenticated(true)
  }

  const logout = () => {
    // Lógica para realizar o logout
    setIsAuthenticated(false)
  }

  // Verifica a autenticação antes de renderizar a página
  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
