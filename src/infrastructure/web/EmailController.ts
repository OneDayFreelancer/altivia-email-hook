import { type Context, Hono } from "hono"
import type { NotifyAuthEmailSentUseCase } from "@/application/NotifyAuthEmailSentUseCase.js"
import { InvalidSignatureError } from "@/domain/exceptions/InvalidSignatureError.js"
import { InvalidAuthEmailError } from "@/domain/exceptions/InvalidAuthEmailError.js"

type ErrorStatus = 400 | 401 | 500

export class EmailController {
  readonly app = new Hono()

  constructor(
    private readonly deps: {
      notifyAuthEmailSentUseCase: NotifyAuthEmailSentUseCase
    },
  ) {
    this.registerRoutes()
  }

  private registerRoutes(): void {
    this.app.get("/health", (c) => c.text("ok"))
    this.app.post("/send-email", (c) => this.handleSendEmail(c))
  }

  private async handleSendEmail(c: Context) {
    try {
      console.log("Entro al endpoint de enviar correo")
      const body = await c.req.text()
      await this.deps.notifyAuthEmailSentUseCase.execute(body, c.req.header())
      return c.json({})
    } catch (err) {
      console.error("[send-email] error:", err)
      if (err instanceof InvalidSignatureError) return this.failure(c, 401, err.message)
      if (err instanceof InvalidAuthEmailError) return this.failure(c, 400, err.message)
      return this.failure(c, 500, "No se pudo enviar el correo")
    }
  }

  private failure(c: Context, status: ErrorStatus, message: string) {
    return c.json({ error: { http_code: status, message } }, status)
  }
}
