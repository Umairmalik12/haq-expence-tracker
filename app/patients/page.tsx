"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientForm } from "@/components/patient-form"
import { PatientTable } from "@/components/patient-table"
import { AuthGuard } from "@/components/auth-guard"
import { usePatients, overallExpensesTotal, currency } from "@/lib/patient-store"

export default function PatientsPage() {
  const { data } = usePatients()
  const totalExpenses = overallExpensesTotal(data ?? [])
  const pendingCount = (data ?? []).filter(
    (p) => p.expenses.reduce((s, e) => s + e.amount, 0) < p.receivingAmount,
  ).length

  const onLogout = () => {
    localStorage.removeItem("session_user")
    window.location.href = "/login"
  }

  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl p-4 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-balance">Patients</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/login">Switch User</Link>
            </Button>
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Overall Expenses</div>
            <div className="text-2xl font-semibold">{currency(totalExpenses)}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Patients</div>
            <div className="text-2xl font-semibold">{data?.length ?? 0}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-semibold">{pendingCount}</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Add Patient</h2>
          <PatientForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Patient List</h2>
          <PatientTable />
        </section>
      </main>
    </AuthGuard>
  )
}
