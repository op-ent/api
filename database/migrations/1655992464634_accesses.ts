import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'accesses'

  public async up() {
    this.schema.raw("CREATE TYPE access_type AS ENUM('token', 'web')")
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.specificType('type', 'access_type').notNullable().defaultTo('token')
      table.specificType('domains', 'varchar[]').nullable()
      table.string('token').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    this.schema.raw(`ALTER TABLE ${this.tableName} ALTER COLUMN id SET DEFAULT uuid_generate_v4()`)
  }

  public async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE access_type')
  }
}
