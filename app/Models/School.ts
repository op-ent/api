import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { jsonColumn } from 'App/Helpers/ModelJson'
import Member from './Member'

export type SchoolContact = {
  email: string
  phone: string
}

export type SchoolAddress = {
  street: string
  city: string
  state: string
  zip: string
}

export default class School extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @jsonColumn()
  public contact: SchoolContact

  @jsonColumn()
  public address: SchoolAddress

  @column()
  public identifier: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @hasMany(() => Member, { foreignKey: 'school_id' })
  public members: HasMany<typeof Member>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
