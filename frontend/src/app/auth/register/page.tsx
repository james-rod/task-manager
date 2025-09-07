"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import type { AxiosError } from "axios";
import "./Register.css";

type RegisterResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosClient.post<RegisterResponse>(
        "/auth/register",
        form
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      router.push("/login");
    } catch (err: unknown) {
      // ✅ Correctly typed Axios error handling
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Registration Failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      {error && <p className="register-error">{error}</p>}

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="register-input"
          required
        />

        <button type="submit" disabled={isLoading} className="register-button">
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

/**
 * Type guard to check if an error is an AxiosError
 */
function isAxiosError<T = unknown>(error: unknown): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
