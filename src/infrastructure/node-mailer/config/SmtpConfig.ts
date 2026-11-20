import type { SmtpProperty } from "./SmtpProperty.js"
import { getMissingKeys } from "@/shared/utils/KeyUtils.js"

const REQUIRED = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"] as const

export const SmtpConfig = {
  loadConfig(env: NodeJS.ProcessEnv = process.env): SmtpProperty {
    const missing = getMissingKeys(env, REQUIRED)
    if (missing.length > 0) {
      throw new Error(`Faltan variables: ${missing.join(", ")}`)
    }

    return {
      host: env.SMTP_HOST as string,
      port: Number(env.SMTP_PORT ?? 587),
      user: env.SMTP_USER as string,
      pass: env.SMTP_PASS as string,
      from: env.MAIL_FROM as string,
    }
  },
}
