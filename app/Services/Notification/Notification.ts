import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { Novu, ITriggerPayload } from '@novu/node'
import User from 'App/Models/User'
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
  private apiKey = Env.get('NOVU_API_KEY', '')

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
    if (this.apiKey === '') {
      Logger.warn('NOVU_API_KEY not set. Skipping notification...')
      return
    }
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
