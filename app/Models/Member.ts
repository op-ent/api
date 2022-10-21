import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { enumColumn } from 'App/Helpers/ModelEnum'
import School from './School'

export type MemberRole = 'student' | 'teacher' | 'parent' | 'staff'

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => School)
  public school: BelongsTo<typeof School>

  @enumColumn()
  public roles: MemberRole[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
