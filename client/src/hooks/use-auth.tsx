"use client"

import axios from "axios"
const useAuth = () => {
  const baseUrl = "/api"

  const getToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      return token
    }
    return null
  }

  const saveToken = (token: string) => {
    localStorage.setItem("token", token)
  }

  const removeToken = () => {
    localStorage.removeItem("token")
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `/auth/login`,
        {
          username,
          password,
        },
        {
          baseURL: baseUrl,
        }
      )
      if (response.data?.access_token) {
        saveToken(response.data?.access_token)
        return response.data?.access_token
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const fetcher = () => {
    const token = getToken() || ""
    return axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  const isLogin = async () => {
    const token = getToken()
    if (!token) {
      return false
    }

    try {
      const refresh = await fetcher().post(`/auth/refresh`)
      console.log("Refresh token response:", refresh)
      if (refresh.data?.access_token) {
        saveToken(refresh.data.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking login status:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      // await axios.post(
      //   `/auth/logout`,
      //   {},
      //   {
      //     baseURL: baseUrl,
      //     headers: {
      //       Authorization: `Bearer ${getToken()}`,
      //     },
      //   }
      // )
      removeToken()
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return {
    login,
    isLogin,
    getToken,
    saveToken,
    removeToken,
    fetcher,
    logout,
  }
}

export default useAuth
