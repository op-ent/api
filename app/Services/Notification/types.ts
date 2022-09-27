import { DEFAULT_NOTIFICATIONS_GROUP_NAME } from './config'

export type EventId = 'welcome'

export interface Integration {
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

export interface StepVariable {
  type: string
  name: string
  defaultValue: string
  required: boolean
}

export interface StepEmailTemplate {
  type: 'email'
  contentType: 'customHtml'
  name: 'Email Message Template'
  subject: string
  htmlContent: string
  variables: StepVariable[]
}

export interface StepSmsTemplate {
  type: 'sms'
  contentType: 'editor'
  name: 'Sms Message Template'
  subject: ''
  content: string
  variables: StepVariable[]
}

export interface NotificationTemplate {
  name: EventId
  notificationGroupId: typeof DEFAULT_NOTIFICATIONS_GROUP_NAME
  tags: string[]
  description: string
  steps: {
    template: StepEmailTemplate | StepSmsTemplate
    active: boolean
  }[]
  active: boolean
  draft: boolean
  critical: boolean
  preferenceSettings: {
    sms: boolean
    in_app: boolean
    chat: boolean
    email: boolean
    push: boolean
  }
}
