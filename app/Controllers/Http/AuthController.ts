import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'
import NotificationService from 'App/Services/Notification'
import { string } from '@ioc:Adonis/Core/Helpers'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

/*
|--------------------------------------------------------------------------
| AuthController
|--------------------------------------------------------------------------
|
| This file is in charge of handling authentication requests.
|
*/
export default class AuthController {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  |
  | This method is in charge of handling registration requests.
  |
  */
  public async register({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({ trim: true }, [rules.confirmed('passwordConfirmation')]),
      }),
    })

    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.forbidden({ error: 'User already exists with this email' })
    }

    const user = await User.create({ email, password })
    NotificationService.subscribers.createSubscriber(user)
    const { token } = await auth.use('api').generate(user)
    return { user, token }
  }

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  |
  | This method is in charge of handling login requests.
  |
  */
  public async login({ auth, request }: HttpContextContract) {
    const { email, password, grantDeveloperAccess } = await request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({ trim: true }),
        grantDeveloperAccess: schema.boolean.optional(),
      }),
    })

    const token = await auth.use('api').attempt(email, password)
    // When logging in to the dev portal, grantDeveloperAccess adds the developer role to the user.
    // Used for analytics and regulation only.
    const user = await User.findBy('email', email)
    if (grantDeveloperAccess && !user!.roles.includes('developer')) {
      user!.roles.push('developer')
      await user?.save()
    }

    return token
  }

  /*
  |--------------------------------------------------------------------------
  | Request password reset
  |--------------------------------------------------------------------------
  |
  | This method is in charge of handling password reset requests.
  | It will send an email to the user with a reset password link.
  |
  */
  public async requestPasswordReset({ request }: HttpContextContract) {
    const { email } = await request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [rules.email()]),
      }),
    })

    const user = await User.findByOrFail('email', email)

    // TODO: check if it's the right route. Maybe we can let customize the URL to match any frontend structure. Maybe.
    const route = Route.makeSignedUrl('/auth/reset-password', { email }, { expiresIn: '60m' })

    console.log(route)

    // TODO: get rid of this
    const token = string.generateRandom(64)
    user.resetPasswordToken = token
    await user.save()

    // TODO: send email to user with a link like this:
    // https://app.op-ent.fr/auth/reset-password?token=${token}
  }

  // TODO: check if really necessary
  /*
  |--------------------------------------------------------------------------
  | Is reset password token valid
  |--------------------------------------------------------------------------
  |
  | This method is in charge of checking if the reset password token
  | exists.
  |
  */
  public async isResetPasswordTokenValid({ request }: HttpContextContract) {
    const token = request.input('token')

    const user = await User.findByOrFail('resetPasswordToken', token)

    return { valid: !!user }
  }

  /*
  |--------------------------------------------------------------------------
  | Reset password
  |--------------------------------------------------------------------------
  |
  | This method is in charge of handling password reset requests.
  |
  */
  public async resetPassword({ request }: HttpContextContract) {
    const token = request.input('token')
    const password = request.input('password')

    const user = await User.findByOrFail('resetPasswordToken', token)
    user.password = password
    user.resetPasswordToken = undefined
    await user.save()
  }
}
