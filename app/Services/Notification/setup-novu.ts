import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { AxiosInstance } from 'axios'
import {
  defaultNotificationsGroupName,
  integrations,
  notificationTemplates,
} from 'Config/notifications'

/**
 * Setup the integrations that are used by the application. Creates, updates and deletes any
 * if necessary.
 */
async function _setupIntegrations(axiosInstance: AxiosInstance) {
  Logger.info('Setting up integrations...')
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

  for (const integration of integrations) {
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
  Logger.info('Setting up notification groups...')
  const {
    data: { data: notificationGroups },
  } = await axiosInstance.get<{
    data: {
      _id: string
      name: string
    }[]
  }>('/notification-groups')

  if (notificationGroups.map((g) => g.name).includes(defaultNotificationsGroupName)) {
    return
  }
  await axiosInstance.post('/notification-groups', {
    name: defaultNotificationsGroupName,
  })
}

async function _setupNotificationTemplates(axiosInstance: AxiosInstance) {
  Logger.info('Setting up notification templates...')
  const {
    data: { data: currentTemplates },
  } = await axiosInstance.get<{
    data: {
      _id: string
    }[]
  }>('/notification-templates')

  for (const template of currentTemplates) {
    await axiosInstance.delete(`/notification-templates/${template._id}`, {
      headers: {
        Authorization: `Bearer ${Env.get('NOVU_PERSONAL_TOKEN')}`,
      },
    })
  }

  const {
    data: { data: notificationGroups },
  } = await axiosInstance.get<{
    data: {
      _id: string
      name: string
    }[]
  }>('/notification-groups')

  const notificationGroupId = notificationGroups.find(
    (g) => g.name === defaultNotificationsGroupName
  )?._id!

  for (const template of notificationTemplates) {
    await axiosInstance.post(
      '/notification-templates',
      { ...template, notificationGroupId },
      {
        headers: {
          Authorization: `Bearer ${Env.get('NOVU_PERSONAL_TOKEN')}`,
        },
      }
    )
  }
}

export async function setupNovu(axiosInstance: AxiosInstance) {
  await _setupIntegrations(axiosInstance)
  await _setupNotificationGroups(axiosInstance)
  await _setupNotificationTemplates(axiosInstance)
}
