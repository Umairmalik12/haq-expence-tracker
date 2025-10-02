"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const session = typeof window !== "undefined" ? localStorage.getItem("session_user") : null
    if (session) router.replace("/patients")
    else router.replace("/login")
  }, [router])
  return null
}
