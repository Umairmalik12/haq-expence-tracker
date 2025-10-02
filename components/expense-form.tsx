"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ExpenseForm({ onAdd }: { onAdd: (e: { date: string; note: string; amount: number }) => void }) {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState("")
  const [amount, setAmount] = useState<number>(0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ date, note: note.trim(), amount: Number(amount) || 0 })
    setNote("")
    setAmount(0)
  }

  return (
    <Card className="p-4">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-6">
        <div className="space-y-1">
          <Label htmlFor="edate">Date</Label>
          <Input id="edate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-1 md:col-span-3">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Lab, medicine, etc."
            rows={1}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="eamount">Amount</Label>
          <Input
            id="eamount"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-1 flex items-end">
          <Button type="submit" className="w-full">
            Add
          </Button>
        </div>
      </form>
    </Card>
  )
}
