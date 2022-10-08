import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class NovuSetup extends BaseCommand {
  public static commandName = 'novu:setup'

  public static description = 'Sets up the novu settings (integrations, templates...)'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { default: Env } = await import('@ioc:Adonis/Core/Env')
    const apiKey = Env.get('NOVU_API_KEY')
    const personalToken = Env.get('NOVU_PERSONAL_TOKEN')
    if (!apiKey) {
      this.logger.error('NOVU_API_KEY not set.')
      return
    }
    if (!personalToken) {
      this.logger.error('NOVU_PERSONAL_TOKEN not set.')
      return
    }
    const { setupNovu } = await import('App/Services/Notification')
    this.logger.info('Setting up novu...')
    try {
      await setupNovu()
      this.logger.success('Novu setup complete!')
    } catch (e) {
      this.logger.warning('Failed to setup novu')
      this.logger.error(e)
    }
  }
}
