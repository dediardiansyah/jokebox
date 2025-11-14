"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      // Login berhasil, redirect ke dashboard
      router.push("/dashboard");
      router.refresh(); // Memaksa refresh untuk menjalankan Middleware
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md" style={{ width: "320px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
      <div className="mb-2 flex justify-center">
        <h2 className="font-bold">Login</h2>
      </div>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="my-4">
          <Label className="mb-1" htmlFor="email">
            Email
          </Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="my-4">
          <Label className="mb-1" htmlFor="password">
            Password
          </Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} className="">
          {loading ? "Logging In..." : "Login"}
        </Button>
      </form>
      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        <p>
          <Link href="/register">Don&apos;t have an account? Register</Link>
        </p>
        <p>
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
