import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class UserDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @computed()
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @belongsTo(() => User)
  public member: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
