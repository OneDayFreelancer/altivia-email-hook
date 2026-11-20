import type { SendAuthEmailUseCase } from "@/application/SendAuthEmailUseCase.js"
import type { WebhookPort } from "@/domain/ports/WebhookPort.js"

export class NotifyAuthEmailSentUseCase {
  constructor(
    private readonly deps: {
      sendAuthEmail: SendAuthEmailUseCase
      notifyWebhook: WebhookPort
    },
  ) {}
  async execute(body: string, headers: Record<string, string>) {
    const authEmail = this.deps.notifyWebhook.verify(body, headers)
    await this.deps.sendAuthEmail.execute(authEmail)
  }
}
