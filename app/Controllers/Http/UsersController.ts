import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async update({ auth, request }: HttpContextContract) {
    const user = auth.user!
    const data = await request.validate({
      schema: schema.create({
        email: schema.string.optional({ trim: true }, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email', whereNot: { id: user.id } }),
        ]),
        password: schema.string.optional({ trim: true }, [rules.confirmed()]),
      }),
    })

    user.merge(data)
    await user.save()

    return user
  }
}
