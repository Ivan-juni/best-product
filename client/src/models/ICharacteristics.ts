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

export interface FormikCharacteristics {
  purpose: string | null
  description: string | null
  design: string | null
  connectionType: string | null
  microphone: boolean
  batteryLiveTime: string | null
  display: string | null
}
