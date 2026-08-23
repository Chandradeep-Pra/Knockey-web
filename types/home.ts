export type HomeStatus = "ACTIVE" | "INACTIVE"

export type Home = {
  id: string
  ownerId: string
  name: string
  address: string
  latitude: number
  longitude: number
  proximityRadius: number
  status: HomeStatus
  createdAt: Date
  updatedAt: Date
}