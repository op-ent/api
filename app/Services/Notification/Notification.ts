import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { Novu, ITriggerPayload } from '@novu/node'
import axios from 'axios'
import User from 'App/Models/User'
import { novuBackendUrl } from 'Config/notifications'
import { setupNovu } from './setup-novu'
import type { EventId } from './types'
import Subscribers from './Subscribers'

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
    baseURL: novuBackendUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${this.apiKey}`,
    },
  })

  public subscribers: Subscribers

  /**
   * Boot the service and setup everything.
   */
  public async boot() {
    Logger.info('Booting notification service...')
    if (this.booted) {
      Logger.warn('Notification service already booted. Skipping...')
      return
    }

    this.booted = true
    this.novu = new Novu(this.apiKey)
    await setupNovu(this.axiosInstance)
    this.subscribers = new Subscribers(this.novu)
    Logger.info('Notification service booted.')
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
    await this._trigger<{ name: string }>('welcome', user, {
      name: `Well we don't have your name but ${user.email}`,
    })
  }
}

export default new NotificationService()
