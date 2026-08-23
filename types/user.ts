export type User = {
  /** Internal system-generated unique identifier. */
  id: string
  /** Globally unique, human-readable Knockey username. */
  firebaseUid: string
  username: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}