import { BaseCommand } from '@adonisjs/core/build/standalone'
import AutoSwagger from 'adonis-autoswagger'
import swagger from 'Config/swagger'

export default class DocsGenerate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'docs:generate'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Generates swagger documentation. To be used in production.'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const Router = await this.application.container.use('Adonis/Core/Route')
    Router.commit()
    await AutoSwagger.writeFile(await Router.toJSON(), swagger)
    this.logger.info('Swagger documentation generated')
  }
}
