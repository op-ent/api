import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class extends BaseSeeder {
  public async run() {
    const email = Env.get('DEFAULT_ADMIN_EMAIL')
    const password = Env.get('DEFAULT_ADMIN_PASSWORD')

    const defaultId = 1

    const existingUser = await User.findBy('id', defaultId)
    if (existingUser) {
      console.log('\nDefault admin already exists, skipping...\n')
      return
    }

    const user = await User.create({
      id: defaultId,
      email,
      password,
      roles: ['user', 'developer'],
    })

    const { id, token } = await user.related('accesses').create({
      type: 'token',
      token: string.generateRandom(64),
    })

    console.log(`\nadmin email: ${email}`)
    console.log(`admin password: ${password}`)
    console.log(`access-id: ${id}`)
    console.log(`access-token: ${token}\n`)
  }
}
