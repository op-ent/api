import { Integration, NotificationTemplate } from './types'

export const DEFAULT_NOTIFICATIONS_GROUP_NAME = 'General'

export const NOVU_BACKEND_URL = 'https://api.novu.co/v1'

/**
 * The integrations that are used by the application.
 */
export const INTEGRATIONS: Integration[] = [
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

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    name: 'welcome',
    notificationGroupId: DEFAULT_NOTIFICATIONS_GROUP_NAME,
    description: 'Message sent when a user signs up',
    tags: [],
    steps: [
      {
        active: true,
        template: {
          type: 'email',
          contentType: 'customHtml',
          name: 'Email Message Template',
          subject: 'Welcome to op-ent',
          htmlContent: '<div>Welcome {{ name }}!</div>',
          variables: [
            {
              type: 'String',
              name: 'name',
              defaultValue: '',
              required: true,
            },
          ],
        },
      },
    ],
    active: true,
    draft: false,
    critical: true,
    preferenceSettings: {
      sms: false,
      in_app: false,
      chat: false,
      email: true,
      push: false,
    },
  },
]
