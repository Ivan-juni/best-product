import { Model } from 'objection'

export default class ProductCharacteristics extends Model {
  static get tableName() {
    return 'product_characteristics'
  }

  id: number
  purpose: string
  description: string
  design: string | null
  connectionType: string | null
  microphone: boolean
  batteryLiveTime: number | null
  display: string | null
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get purposeColumn(): string {
    return 'purpose'
  }

  static get descriptionColumn(): string {
    return 'description'
  }

  static get designColumn(): string {
    return 'design'
  }

  static get connectionTypeColumn(): string {
    return 'connectionType'
  }

  static get microphoneColumn(): string {
    return 'microphone'
  }

  static get batteryLiveTimeColumn(): string {
    return 'batteryLiveTime'
  }

  static get displayColumn(): string {
    return 'display'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['purpose', 'description'],

      properties: {
        id: { type: 'integer' },
        purpose: { type: 'string' },
        description: { type: 'string', maxLength: 500 },
        design: { type: ['string', 'null'] },
        connectionType: { type: ['string', 'null'] },
        microphone: { type: 'boolean', default: false },
        batteryLiveTime: { type: ['number', 'null'] },
        display: { type: ['string', 'null'] },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
