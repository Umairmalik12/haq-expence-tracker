"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePatients, patientRemaining, patientStatus, currency } from "@/lib/patient-store"

export function PatientTable() {
  const { data } = usePatients()
  const patients = data ?? []

  return (
    <Card className="p-4">
      <div className="grid grid-cols-12 gap-2 text-sm font-medium mb-2 text-muted-foreground">
        <div className="col-span-2">Date</div>
        <div className="col-span-3">Patient</div>
        <div className="col-span-3">Procedure</div>
        <div className="col-span-2">Receiving</div>
        <div className="col-span-1">Remain</div>
        <div className="col-span-1 text-right">Status</div>
      </div>
      <div className="space-y-2">
        {patients.length === 0 ? (
          <p className="text-sm text-muted-foreground">No patients yet. Add a new patient above.</p>
        ) : (
          patients.map((p) => {
            const remaining = patientRemaining(p)
            const status = patientStatus(p)
            return (
              <Link
                key={p.id}
                href={`/patients/${p.id}`}
                className="grid grid-cols-12 gap-2 items-center rounded-md border p-2 hover:bg-muted/40"
              >
                <div className="col-span-2">{p.date}</div>
                <div className="col-span-3">{p.name}</div>
                <div className="col-span-3">{p.procedure || "-"}</div>
                <div className="col-span-2">{currency(p.receivingAmount)}</div>
                <div className="col-span-1">{currency(remaining)}</div>
                <div className="col-span-1 text-right">
                  <Badge variant={status === "Complete" ? "default" : status === "Over" ? "destructive" : "secondary"}>
                    {status}
                  </Badge>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </Card>
  )
}
