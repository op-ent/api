import { Novu } from '@novu/node'
import User from 'App/Models/User'

export default class Subscribers {
  private novu: Novu
  private debug: boolean

  constructor(novu: Novu, debug: boolean) {
    this.novu = novu
    this.debug = debug
  }

  public async createSubscriber({ id, email }: User) {
    if (this.debug) return
    await this.novu.subscribers.identify(id.toString(), { email })
  }

  public async updateSubscriber({ id, email }: User) {
    if (this.debug) return
    await this.novu.subscribers.update(id.toString(), { email })
  }

  public async deleteSubscriber({ id }: User) {
    if (this.debug) return
    await this.novu.subscribers.delete(id.toString())
  }
}
