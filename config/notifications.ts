import type { Integration, NotificationTemplate } from 'App/Services/Notification/types'

export const defaultNotificationsGroupName = 'General'

export const novuBackendUrl = 'https://api.novu.co/v1'

/**
 * The integrations that are used by the application.
 */
export const integrations: Integration[] = [
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

export const notificationTemplates: NotificationTemplate[] = [
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
