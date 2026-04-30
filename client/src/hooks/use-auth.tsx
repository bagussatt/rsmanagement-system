import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/lib/sweetalert";

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

      // Show success alert
      await showSuccessAlert('Login Berhasil', 'Selamat datang kembali!')

      return response.data;
    } catch (err: any) {
      // Menangani error login (bisa berupa string atau array pesan dari NestJS)
      const message = err.response?.data?.message || "Login gagal";
      const formattedMessage = Array.isArray(message) ? message.join(", ") : message;

      setError(formattedMessage);

      // Show error alert
      await showErrorAlert('Login Gagal', formattedMessage)

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

      // Show success alert
      await showSuccessAlert('Registrasi Berhasil', 'Akun Anda telah berhasil dibuat!')

      return response.data;
    } catch (err: any) {
      // Menangani error register (Error 400 atau validasi)
      const message = err.response?.data?.message || "Gagal mendaftarkan akun.";
      const formattedMessage = Array.isArray(message) ? message.join(", ") : message;

      setError(formattedMessage);

      // Show error alert
      await showErrorAlert('Registrasi Gagal', formattedMessage)

      throw new Error(formattedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi Logout
   */
  const logout = async () => {
    const result = await showConfirmAlert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      'Ya, Keluar',
      'Batal'
    );

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      await showSuccessAlert('Logout Berhasil', 'Sampai jumpa kembali!')
      router.push("/login");
    }
  };

  return { register, login, logout, isLoading, error, setError, user, fetchProfile };
}