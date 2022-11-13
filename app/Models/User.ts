import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Access from 'App/Models/Access'

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

  @column({
    prepare: (value: string[]): string => `{${value.join(',')}}`,
    consume: (value: string): string[] => value.slice(1, -1).split(','),
  })
  public roles: UserRole[]

  @hasMany(() => Access, { foreignKey: 'user_id' })
  public accesses: HasMany<typeof Access>

  @column()
  public resetPasswordToken?: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
