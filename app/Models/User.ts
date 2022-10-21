import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Access from 'App/Models/Access'
import Member from './Member'
import { enumColumn } from 'App/Helpers/ModelEnum'
import UserDetail from './UserDetail'

export type UserRole = 'admin' | 'user' | 'developer'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @enumColumn()
  public roles: UserRole[]

  @hasMany(() => Access, { foreignKey: 'user_id' })
  public accesses: HasMany<typeof Access>

  @hasMany(() => Member, { foreignKey: 'user_id' })
  public members: HasMany<typeof Member>

  @hasOne(() => UserDetail, { foreignKey: 'user_id' })
  public detail: HasOne<typeof UserDetail>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
