"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const session = localStorage.getItem("session_user")
    if (!session) router.replace("/login")
  }, [router])
  return <>{children}</>
}
