import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi Login
   */
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });

      const { access_token } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem("token", access_token);

      // Fetch user profile immediately after login
      await fetchProfile();

      return response.data;
    } catch (err: any) {
      // Menangani error login (bisa berupa string atau array pesan dari NestJS)
      const message = err.response?.data?.message || "Login gagal";
      const formattedMessage = Array.isArray(message) ? message.join(", ") : message;

      setError(formattedMessage);
      throw new Error(formattedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi Register
   */
  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (err: any) {
      // Menangani error register (Error 400 atau validasi)
      const message = err.response?.data?.message || "Gagal mendaftarkan akun.";
      const formattedMessage = Array.isArray(message) ? message.join(", ") : message;
      
      setError(formattedMessage);
      throw new Error(formattedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi Logout
   */
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return { register, login, logout, isLoading, error, setError, user, fetchProfile };
}