// A tiny localStorage-backed "DB" with SWR syncing.

import useSWR, { mutate } from "swr"

export type Expense = {
  id: string
  date: string // ISO
  note: string
  amount: number
}

export type Patient = {
  id: string
  date: string // ISO
  name: string
  procedure: string
  totalAmount: number
  receivingAmount: number
  expenses: Expense[]
}

const KEY = "patients_db_v1"

function readDB(): Patient[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as Patient[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeDB(data: Patient[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

const fetcher = () => readDB()

export function usePatients() {
  return useSWR<Patient[]>(KEY, fetcher, { revalidateOnFocus: false })
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function addPatient(p: Omit<Patient, "id" | "expenses">) {
  const db = readDB()
  const newPatient: Patient = { ...p, id: uid("p"), expenses: [] }
  writeDB([newPatient, ...db])
  mutate(KEY)
  return newPatient.id
}

export function addExpense(patientId: string, e: Omit<Expense, "id">) {
  const db = readDB()
  const idx = db.findIndex((p) => p.id === patientId)
  if (idx === -1) return
  const exp: Expense = { ...e, id: uid("e") }
  db[idx] = { ...db[idx], expenses: [exp, ...db[idx].expenses] }
  writeDB(db)
  mutate(KEY)
}

export function removeExpense(patientId: string, expenseId: string) {
  const db = readDB()
  const idx = db.findIndex((p) => p.id === patientId)
  if (idx === -1) return
  db[idx] = { ...db[idx], expenses: db[idx].expenses.filter((e) => e.id !== expenseId) }
  writeDB(db)
  mutate(KEY)
}

export function getPatientById(id: string): Patient | null {
  const db = readDB()
  return db.find((p) => p.id === id) ?? null
}

export function updatePatientReceiving(id: string, receivingAmount: number) {
  const db = readDB()
  const idx = db.findIndex((p) => p.id === id)
  if (idx === -1) return
  db[idx] = { ...db[idx], receivingAmount }
  writeDB(db)
  mutate(KEY)
}

export function overallExpensesTotal(patients: Patient[]) {
  return patients.reduce((sum, p) => sum + p.expenses.reduce((s, e) => s + e.amount, 0), 0)
}

export function patientRemaining(p: Patient) {
  const spent = p.expenses.reduce((s, e) => s + e.amount, 0)
  return Math.max(p.receivingAmount - spent, 0)
}

export function patientStatus(p: Patient) {
  const spent = p.expenses.reduce((s, e) => s + e.amount, 0)
  if (spent === p.receivingAmount) return "Complete"
  if (spent > p.receivingAmount) return "Over"
  return "Pending"
}

export function currency(n: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n)
}
