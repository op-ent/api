import User from 'App/Models/User'

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export type AccessType = 'token' | 'web'

export default class Access extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public type: AccessType

  @column()
  public domains?: string[]

  @column()
  public token?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
