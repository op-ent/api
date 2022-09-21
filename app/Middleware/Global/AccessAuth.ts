import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import Access from 'App/Models/Access'

export default class AccessAuth {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const accessId = request.header('access-id')
    const accessToken = request.header('access-token')

    await validator.validate({
      schema: schema.create({
        accessId: schema.string([rules.uuid({ version: 4 })]),
        accessToken: schema.string.optional([rules.length(64)]),
      }),
      data: {
        accessId,
        accessToken,
      },
      messages: {
        required: 'You must provide an access_id header to access the api. Read more on ...',
      },
    })

    const access = await Access.findByOrFail('access_id', accessId)
    console.log("that's fine")
    if (access.type === 'token') {
      if (!accessToken) {
        throw new Error(
          'You must provide an access_token header to access the api. Read more on ...'
        )
      } else if (access.token !== accessToken) {
        throw new Error('Invalid access token')
      }
    } else {
      const origin = request.header('origin')
      if (!origin || !access.domains!.includes(origin)) {
        throw new Error('Access denied from this domain')
      }
    }

    await next()
  }
}
