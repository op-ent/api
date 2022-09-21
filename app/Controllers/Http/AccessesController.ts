import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Access from 'App/Models/Access'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class AccessesController {
  private async _validateAccess({ auth, params }: HttpContextContract) {
    await validator.validate({
      schema: schema.create({ id: schema.number() }),
      data: {
        id: params.id,
      },
    })

    const access = await Access.findOrFail(params.id)
    if (access.user_id !== auth.user!.id) {
      throw new Error('You are not allowed to access this app consumer')
    }
    return access
  }

  public async index({ auth }: HttpContextContract) {
    return await Access.query().where('user_id', auth.user!.id)
  }

  public async store({ request, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        type: schema.enum(['token', 'web'] as const),
        domains: schema.array.optional([rules.minLength(1)]).members(schema.string([rules.url()])),
      }),
    })

    const useToken = payload.type === 'token'
    const user = auth.user!

    return await user.related('accesses').create({
      type: payload.type,
      domains: useToken ? undefined : payload.domains,
      token: useToken ? string.generateRandom(64) : undefined,
    })
  }

  public async show(ctx: HttpContextContract) {
    return await this._validateAccess(ctx)
  }

  public async update(ctx: HttpContextContract) {
    const { request } = ctx
    const error =
      "You can only update an app consumer setup for web by providing domains. Token can't be updated. Revoke it and generate a new one instead."

    const payload = await request.validate({
      schema: schema.create({
        domains: schema.array([rules.minLength(1)]).members(schema.string([rules.url()])),
      }),
      messages: {
        required: error,
      },
    })

    const access = await this._validateAccess(ctx)
    if (access.type !== 'web') {
      throw new Error(error)
    }

    await access.merge({ domains: payload.domains }).save()
    return access
  }

  public async destroy(ctx: HttpContextContract) {
    const access = await this._validateAccess(ctx)
    const temp = access
    await access.delete()
    return temp
  }
}
