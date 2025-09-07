"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkTokenExpiration } from "@/utils/checkTokenExpiration";
import { useAuthStore } from "@/store/useAuthStore";
import Spinner from "@/components/Spinner";
import "./Navbar.css"; // import the CSS

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTokenExpiration();
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          TaskManager
        </Link>

        {/* Nav Links */}
        {loading ? (
          <Spinner />
        ) : (
          <ul className="navbar-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            {user ? (
              <>
                <li className="navbar-user">Welcome, {user.name}</li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">Login</Link>
                </li>
                <li>
                  <Link href="/auth/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}
