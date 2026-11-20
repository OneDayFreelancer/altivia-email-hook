import type { WebhookProperty } from "@/infrastructure/webhook/config/WebhookProperty.js"
import { getMissingKeys } from "@/shared/utils/KeyUtils.js"

const REQUIRED = ["SEND_EMAIL_HOOK_SECRET"] as const

export const WebhookConfig = {
  loadConfig(env: NodeJS.ProcessEnv = process.env): WebhookProperty {
    const missing = getMissingKeys(env, REQUIRED)
    if (missing.length > 0) {
      throw new Error(`Faltan variables: ${missing.join(", ")}`)
    }

    return {
      secret: env.SEND_EMAIL_HOOK_SECRET as string,
    }
  },
}
