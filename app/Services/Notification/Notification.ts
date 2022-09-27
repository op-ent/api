import { Novu, ITriggerPayload } from '@novu/node'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import axios from 'axios'
import { NOVU_BACKEND_URL } from './config'
import { setupNovu } from './setup-novu'
import { EventId } from './types'

/**
 * The NotificationService class is responsible for managing any notification logic
 * for the application (e.g. sending, register users, etc).
 */
class NotificationService {
  /**
   * The novu client instance.
   */
  private novu: Novu

  /**
   * Prevent the service from being booted more than once.
   */
  private booted = false

  /**
   * The {@link this.novu} API key.
   */
  private apiKey = Env.get('NOVU_API_KEY')

  /**
   * The axios client to interact with the {@link novu} API that is not accesible
   * through the client.
   */
  private axiosInstance = axios.create({
    baseURL: NOVU_BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${this.apiKey}`,
    },
  })

  /**
   * Boot the service and setup everything.
   */
  public async boot() {
    console.log('Booting notification service...')
    if (this.booted) {
      console.log('Notification service already booted. Skipping...')
      return
    }

    this.booted = true
    this.novu = new Novu(this.apiKey)
    await setupNovu(this.axiosInstance)
    console.log('Notification service booted.')
  }

  /**
   * Send a notification to a user.
   */
  private async _trigger<T extends Record<string, any>>(
    eventId: EventId,
    user: User,
    payload: ITriggerPayload & T
  ) {
    return await this.novu.trigger(eventId, {
      to: {
        subscriberId: user.id.toString(),
      },
      payload,
    })
  }

  public async sendWelcomeEmail(user: User) {
    await this._trigger<{ hello: 'world' }>('welcome', user, {
      hello: 'world',
    })
  }
}

export default new NotificationService()
