export type DoorStatus = "ACTIVE" | "INACTIVE"

export type Door = {
  id: string
  homeId: string
  doorNo: string
  name?: string
  status: DoorStatus
  createdAt: Date
  updatedAt: Date
}