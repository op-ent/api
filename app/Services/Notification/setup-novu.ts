import { AxiosInstance } from 'axios'
import { DEFAULT_NOTIFICATIONS_GROUP_NAME, INTEGRATIONS, NOTIFICATION_TEMPLATES } from './config'

/**
 * Setup the integrations that are used by the application. Creates, updates and deletes any
 * if necessary.
 */
async function _setupIntegrations(axiosInstance: AxiosInstance) {
  // https://github.com/novuhq/novu/blob/main/apps/api/src/app/integrations/integrations.controller.ts#L59
  const {
    data: { data: activeIntegrations },
  } = await axiosInstance.get<{
    data: {
      _id: string
    }[]
  }>('/integrations/active')

  for (const activeIntegration of activeIntegrations) {
    await axiosInstance.delete(`/integrations/${activeIntegration._id}`)
  }

  for (const integration of INTEGRATIONS) {
    await axiosInstance.post('/integrations', integration)
  }

  // TODO: wait for Discord response
  // for (const integration of INTEGRATIONS) {
  //   const activeIntegration = activeIntegrations.find(
  // (i) => i.providerId === integration.providerId && i.channel === integration.channel
  //   )

  //   const alreadyExists = !!activeIntegration

  //   if (alreadyExists) {
  // await axiosInstance.put(`/integrations/${activeIntegration._id}`, {
  //   credentials: integration.credentials,
  //   active: integration.active,
  // })
  //   } else {
  // await axiosInstance.post('/integrations', integration)
  //   }
  // }

  // const unusedIntegrations = activeIntegrations.filter((i) => {
  //   return INTEGRATIONS.find(
  //     (integration) =>
  //       integration.providerId === i.providerId && integration.channel === i.channel
  //   )
  // })

  // for (const unusedIntegration of unusedIntegrations) {
  //   await axiosInstance.delete(`/integrations/${unusedIntegration._id}`)
  // }
}

async function _setupNotificationGroups(axiosInstance: AxiosInstance) {
  const {
    data: { data: notificationGroups },
  } = await axiosInstance.get<{
    data: {
      _id: string
      name: string
    }[]
  }>('/notification-groups')

  if (notificationGroups.map((g) => g.name).includes(DEFAULT_NOTIFICATIONS_GROUP_NAME)) {
    return
  }
  await axiosInstance.post('/notification-groups', {
    name: DEFAULT_NOTIFICATIONS_GROUP_NAME,
  })
}

async function _setupNotificationTemplates(axiosInstance: AxiosInstance) {
  const {
    data: { data: currentTemplates },
  } = await axiosInstance.get<{
    data: {
      _id: string
    }[]
  }>('/notification-templates')

  for (const template of currentTemplates) {
    await axiosInstance.delete(`/notification-templates/${template._id}`)
  }

  // for (const template of NOTIFICATION_TEMPLATES) {
  //   await axiosInstance.post('/notification-templates', template)
  // }
}

export async function setupNovu(axiosInstance: AxiosInstance) {
  await _setupIntegrations(axiosInstance)
  await _setupNotificationGroups(axiosInstance)
  await _setupNotificationTemplates(axiosInstance)
}
