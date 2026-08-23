export type VisitStatus =
  | "WAITING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"

export type VisitEvent = {
  id: string
  homeId: string
  doorId: string
  visitorName?: string
  visitorPhone?: string
  purpose?: string
  status: VisitStatus
  createdAt: Date
  respondedAt?: Date
}