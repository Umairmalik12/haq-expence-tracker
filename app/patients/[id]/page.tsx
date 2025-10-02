"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExpenseForm } from "@/components/expense-form"
import { AuthGuard } from "@/components/auth-guard"
import {
  usePatients,
  getPatientById,
  addExpense,
  removeExpense,
  updatePatientReceiving,
  patientStatus,
  currency,
} from "@/lib/patient-store"

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data } = usePatients() // subscribe so UI refreshes
  const patient = useMemo(() => getPatientById(params.id), [params.id, data])
  const [newReceiving, setNewReceiving] = useState<number>(patient?.receivingAmount ?? 0)

  if (!patient) {
    return (
      <AuthGuard>
        <main className="mx-auto max-w-4xl p-4 space-y-6">
          <p className="text-sm text-muted-foreground">Patient not found.</p>
          <Button asChild>
            <Link href="/patients">Back to list</Link>
          </Button>
        </main>
      </AuthGuard>
    )
  }

  const spent = patient.expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = Math.max(patient.receivingAmount - spent, 0)
  const over = Math.max(spent - patient.receivingAmount, 0)
  const status = patientStatus(patient)

  const onAddExpense = (e: { date: string; note: string; amount: number }) => {
    addExpense(patient.id, e)
  }

  const onRemoveExpense = (expenseId: string) => {
    removeExpense(patient.id, expenseId)
  }

  const onUpdateReceiving = (e: React.FormEvent) => {
    e.preventDefault()
    updatePatientReceiving(patient.id, Number(newReceiving) || 0)
  }

  return (
    <AuthGuard>
      <main className="mx-auto max-w-5xl p-4 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{patient.name}</h1>
            <p className="text-sm text-muted-foreground">
              {patient.procedure || "No procedure"} • {patient.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status === "Complete" ? "default" : status === "Over" ? "destructive" : "secondary"}>
              {status}
            </Badge>
            <Button asChild variant="secondary">
              <Link href="/patients">Back</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-semibold">{currency(patient.totalAmount)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Receiving</div>
            <div className="text-2xl font-semibold">{currency(patient.receivingAmount)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Spent / Remaining</div>
            <div className="text-2xl font-semibold">
              {currency(spent)} <span className="text-muted-foreground text-sm">spent</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {over > 0 ? <>Over by {currency(over)}</> : <>Remaining {currency(remaining)}</>}
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Update Receiving</h2>
          <Card className="p-4">
            <form onSubmit={onUpdateReceiving} className="grid gap-3 md:grid-cols-4">
              <div className="space-y-1 md:col-span-3">
                <Label htmlFor="recv">Receiving Amount</Label>
                <Input
                  id="recv"
                  type="number"
                  min={0}
                  value={newReceiving}
                  onChange={(e) => setNewReceiving(Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Add Expense</h2>
          <ExpenseForm onAdd={onAddExpense} />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Expenses</h2>
          <Card className="p-3">
            {patient.expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses yet.</p>
            ) : (
              <div className="space-y-2">
                {patient.expenses.map((e) => (
                  <div key={e.id} className="grid grid-cols-12 gap-2 items-center rounded-md border p-2">
                    <div className="col-span-2 text-sm">{e.date}</div>
                    <div className="col-span-7 text-sm">{e.note || "-"}</div>
                    <div className="col-span-2 text-sm font-medium">{currency(e.amount)}</div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="sm" variant="destructive" onClick={() => onRemoveExpense(e.id)}>
                        Del
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t grid grid-cols-12 items-center">
                  <div className="col-span-9 text-sm font-medium">Total</div>
                  <div className="col-span-2 text-sm font-semibold">{currency(spent)}</div>
                  <div className="col-span-1" />
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>
    </AuthGuard>
  )
}
