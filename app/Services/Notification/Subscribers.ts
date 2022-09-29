import { Novu } from '@novu/node'
import User from 'App/Models/User'

export default class Subscribers {
  private novu: Novu

  constructor(novu: Novu) {
    this.novu = novu
  }

  public async createSubscriber({ id, email }: User) {
    await this.novu.subscribers.identify(id.toString(), { email })
  }

  public async updateSubscriber({ id, email }: User) {
    await this.novu.subscribers.update(id.toString(), { email })
  }

  public async deleteSubscriber({ id }: User) {
    await this.novu.subscribers.delete(id.toString())
  }
}
