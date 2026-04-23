"use client"
import useAuth from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  enum AuthStatus {
    AUTHENTICATED = "authenticated",
    UNAUTHENTICATED = "unauthenticated",
    LOADING = "loading",
  }
  const { isLogin } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState<AuthStatus>(
    AuthStatus.LOADING
  )
  const router = useRouter()

  useEffect(() => {
    const checkAuthentication = async () => {
      const loggedIn = await isLogin()
      setIsAuthenticated(
        loggedIn ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED
      )

      if (!loggedIn) {
        router.push("/login?msg=You must be logged in to access this page")
      }
    }
    checkAuthentication()
  }, [isLogin, router, AuthStatus])

  return (
    <div>{isAuthenticated === AuthStatus.AUTHENTICATED && <>{children}</>}</div>
  )
}
