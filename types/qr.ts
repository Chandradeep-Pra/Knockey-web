export type QRTokenStatus = "ACTIVE" | "REVOKED"

export type QRToken = {
  id: string
  doorId: string
  tokenHash: string   /** Server-side hash of the unique random token embedded in the QR. */
  status: QRTokenStatus
  createdAt: Date
  revokedAt?: Date
}

export type ScanQRRequest = {
  rawToken: string
  latitude: number
  longitude: number
}