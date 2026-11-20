import nodeProcess from "node:process"
import { type ServerType, serve } from "@hono/node-server"
import { NotifyAuthEmailSentUseCase } from "@/application/NotifyAuthEmailSentUseCase.js"
import { SendAuthEmailUseCase } from "@/application/SendAuthEmailUseCase.js"
import { HtmlTemplateConfig } from "@/infrastructure/node-mailer/config/HtmlTemplateConfig.js"
import { SmtpConfig } from "@/infrastructure/node-mailer/config/SmtpConfig.js"
import { NodeMailerAdapter } from "@/infrastructure/node-mailer/NodeMailerAdapter.js"
import { SupabaseHtmlTemplateAdapter } from "@/infrastructure/node-mailer/SupabaseHtmlTemplateAdapter.js"
import { EmailController } from "@/infrastructure/web/EmailController.js"
import { WebhookConfig } from "@/infrastructure/webhook/config/WebhookConfig.js"
import { NotifyWebhookAdapter } from "@/infrastructure/webhook/NotifyWebhookAdapter.js"
import { ServerConfig } from "@/shared/config/ServerConfig.js"

export class Main {
  private server?: ServerType

  start(): void {
    //infrastructure
    const htmlTemplateConfig = HtmlTemplateConfig.loadConfig()
    const htmlTemplatePort = new SupabaseHtmlTemplateAdapter(htmlTemplateConfig)

    const smtpConfig = SmtpConfig.loadConfig()
    const mailerPort = new NodeMailerAdapter(smtpConfig)

    const webhookConfig = WebhookConfig.loadConfig()
    const webhookPort = new NotifyWebhookAdapter(webhookConfig)

    // application
    const sendAuthEmailUseCase = new SendAuthEmailUseCase({
      renderer: htmlTemplatePort,
      mailer: mailerPort,
    })
    const notifyAuthEmailSentUseCase = new NotifyAuthEmailSentUseCase({
      sendAuthEmail: sendAuthEmailUseCase,
      notifyWebhook: webhookPort,
    })

    // server
    const serverConfig = ServerConfig.loadConfig()
    const webController = new EmailController({ notifyAuthEmailSentUseCase })

    this.server = serve({ fetch: webController.app.fetch, port: serverConfig.port })
    console.log(`Servidor escuchando en el puerto ${serverConfig.port}`)
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve()
      this.server.close((err) => (err ? reject(err) : resolve()))
    })
  }
}

const main = new Main()
main.start()

nodeProcess.on("SIGTERM", () => main.stop())
nodeProcess.on("SIGINT", async () => {
  await main.stop()
  nodeProcess.exit(0)
})
