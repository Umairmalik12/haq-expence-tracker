"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple demo auth: username/password must both be "sardar123"
    if (username === "sardar123" && password === "sardar123") {
      localStorage.setItem("session_user", JSON.stringify({ u: "sardar123" }))
      router.replace("/patients")
    } else {
      setError("Invalid credentials. Use sardar123 / sardar123")
    }
  }

  return (
    <main className="min-h-dvh px-4 py-8">
      <Card className="w-full rounded-none p-6">
        <h1 className="text-2xl font-semibold mb-1 text-balance">Haq Medical Expence tracker</h1>
        <p className="text-sm text-muted-foreground mb-6">Please sign in to continue</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter user name"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  )
}
