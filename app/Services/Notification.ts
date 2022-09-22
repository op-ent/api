import { Novu, ITriggerPayload } from '@novu/node'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import axios from 'axios'

type EventId = 'welcome'

interface Integration {
  providerId: string
  channel: 'email' | 'sms' | 'chat' | 'push'
  credentials: {
    apiKey?: string
    user?: string
    secretKey?: string
    domain?: string
    password?: string
    host?: string
    port?: string
    secure?: boolean
    region?: string
    accountSid?: string
    messageProfileId?: string
    token?: string
    from?: string
    senderName?: string
    projectName?: string
    applicationId?: string
    novuId?: string
    serviceAccount?: string
  }
  active: boolean
}

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
   * The {@link novu} API key.
   */
  private apiKey = Env.get('NOVU_API_KEY')

  /**
   * The axios client to interact with the {@link novu} API that is not accesible
   * through the client.
   */
  private axiosClient = axios.create({
    baseURL: 'https://api.novu.co/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${this.apiKey}`,
    },
  })

  /**
   * The integrations that are used by the application. Kept up to date automatically
   * by the {@link _setupIntegrations} method.
   */
  private integrations: Integration[] = [
    {
      providerId: 'nodemailer',
      channel: 'email',
      active: true,
      credentials: {
        user: '',
        password: '',
        host: '',
        port: '',
        from: '',
        senderName: '',
      },
    },
    {
      providerId: 'twilio',
      channel: 'sms',
      active: true,
      credentials: {
        accountSid: '',
        token: '',
        from: '',
      },
    },
    {
      providerId: 'fcm',
      channel: 'push',
      active: true,
      credentials: {
        serviceAccount: '',
      },
    },
  ]

  private notificationGroups = []
  private notificationTemplates = []

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
    await this._setupIntegrations()
    console.log('Notification service booted.')
  }

  /**
   * Setup the integrations that are used by the application. Creates, updates and deletes any
   * if necessary.
   */
  private async _setupIntegrations() {
    // https://github.com/novuhq/novu/blob/main/apps/api/src/app/integrations/integrations.controller.ts#L59
    const {
      data: { data: activeIntegrations },
    } = await this.axiosClient.get<{
      data: {
        _id: string
        _environmentId: string
        _organizationId: string
        providerId: string
        channel: string
        active: boolean
        deleted: boolean
        deletedAt: string
        deletedBy: string
      }[]
    }>('/integrations/active')

    for (const activeIntegration of activeIntegrations) {
      await this.axiosClient.delete(`/integrations/${activeIntegration._id}`)
    }

    for (const integration of this.integrations) {
      await this.axiosClient.post('/integrations', integration)
    }

    // TODO: wait for Discord response
    // for (const integration of this.integrations) {
    //   const activeIntegration = activeIntegrations.find(
    // (i) => i.providerId === integration.providerId && i.channel === integration.channel
    //   )

    //   const alreadyExists = !!activeIntegration

    //   if (alreadyExists) {
    // await this.axiosClient.put(`/integrations/${activeIntegration._id}`, {
    //   credentials: integration.credentials,
    //   active: integration.active,
    // })
    //   } else {
    // await this.axiosClient.post('/integrations', integration)
    //   }
    // }

    // const unusedIntegrations = activeIntegrations.filter((i) => {
    //   return this.integrations.find(
    //     (integration) =>
    //       integration.providerId === i.providerId && integration.channel === i.channel
    //   )
    // })

    // for (const unusedIntegration of unusedIntegrations) {
    //   await this.axiosClient.delete(`/integrations/${unusedIntegration._id}`)
    // }
  }

  /**
   * Send a notification to a user.
   */
  private async _trigger(eventId: EventId, user: User, payload: ITriggerPayload) {
    return await this.novu.trigger(eventId, {
      to: {
        subscriberId: user.id.toString(),
      },
      payload,
    })
  }

  public async sendWelcomeEmail(user: User) {
    await this._trigger('welcome', user, {
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      email: user.email,
    })
  }
}

export default new NotificationService()
