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
    notificationGroupId: null,
    description: 'Message sent when a user signs up',
    steps: [
      {
        template: {
          type: 'email',
          name: 'Email Message Template',
          subject: 'Welcome to op-ent',
          content: '<div>Welcome {{name}}!</div>',
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
    critical: true,
    preferenceSettings: {
      sms: false,
      in_app: false,
      chat: false,
      email: true,
      push: false,
    },
  },
].map((template) => {
  const o = {
    ...template,
    tags: [],
    active: true,
    draft: false,
  }
  for (const step of o.steps) {
    step['active'] = true
    if (step.template.type === 'email') {
      step.template['contentType'] = 'customHtml'
    }
  }
  return o
}) as any
