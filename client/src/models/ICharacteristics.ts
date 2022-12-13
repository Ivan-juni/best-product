export interface ICharacteristics {
  id: number
  purpose: string
  description: string
  design: string | null
  connectionType: string | null
  microphone: boolean | null
  batteryLiveTime: number | null
  display: string | null
  createdAt?: string
  updatedAt?: string
}
