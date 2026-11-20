import type { AuthEmail } from "../domain/models/AuthEmail.js"
import type { HtmlTemplatePort } from "../domain/ports/HtmlTemplatePort.js"
import type { MailerPort } from "../domain/ports/MailerPort.js"

export class SendAuthEmailUseCase {
  constructor(private readonly deps: { renderer: HtmlTemplatePort; mailer: MailerPort }) {}

  async execute(email: AuthEmail): Promise<void> {
    const { subject, html, text } = this.deps.renderer.render(email)
    await this.deps.mailer.send({ to: email.to, subject, html, text })
  }
}
