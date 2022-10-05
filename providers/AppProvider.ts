import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import NotificationService from 'App/Services/Notification'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    await NotificationService.boot()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
