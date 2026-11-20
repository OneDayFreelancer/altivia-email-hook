import { Webhook } from "standardwebhooks"
import type { WebhookPort } from "@/domain/ports/WebhookPort.js"
import { InvalidSignatureError } from "@/domain/exceptions/InvalidSignatureError.js"
import { SupabaseWebhookMapper } from "@/infrastructure/webhook/mappers/SupabaseWebhookMapper.js"
import type { AuthEmail } from "@/domain/models/AuthEmail.js"
import type { WebhookProperty } from "@/infrastructure/webhook/config/WebhookProperty.js"

/** Verifica la firma Standard Webhooks con que Supabase firma el hook. */
export class NotifyWebhookAdapter implements WebhookPort {
  private readonly webhook: Webhook

  constructor({ secret }: WebhookProperty) {
    // Supabase entrega "v1,whsec_<base64>"; la librería quiere solo el base64.
    this.webhook = new Webhook(secret.replace(/^v1,whsec_/, ""))
  }

  verify(body: string, headers: Record<string, string>): AuthEmail {
    try {
      const payload = this.webhook.verify(body, headers)
      return SupabaseWebhookMapper.toAuthEmail(payload)
    } catch {
      throw new InvalidSignatureError()
    }
  }
}
