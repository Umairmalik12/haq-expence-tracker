"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { addPatient } from "@/lib/patient-store"
import { useRouter } from "next/navigation"

export function PatientForm() {
  const router = useRouter()
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [name, setName] = useState("")
  const [procedure, setProcedure] = useState("")
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [receivingAmount, setReceivingAmount] = useState<number>(0)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = addPatient({
      date,
      name: name.trim(),
      procedure: procedure.trim(),
      totalAmount: Number(totalAmount) || 0,
      receivingAmount: Number(receivingAmount) || 0,
    })
    router.push(`/patients/${id}`)
  }

  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-5">
        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="name">Patient Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="procedure">Procedure</Label>
          <Input
            id="procedure"
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            placeholder="Procedure"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="total">Total</Label>
          <Input
            id="total"
            type="number"
            min={0}
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="receiving">Receiving</Label>
          <Input
            id="receiving"
            type="number"
            min={0}
            value={receivingAmount}
            onChange={(e) => setReceivingAmount(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-5">
          <Button type="submit">Add Patient</Button>
        </div>
      </form>
    </Card>
  )
}
