import type {SmtpProperty} from "./SmtpProperty.js";
import {KeyUtils} from "@/shared/utils/KeyUtils.js";

const REQUIRED = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
] as const;

export class SmtpConfig {
    static loadConfig(env: NodeJS.ProcessEnv = process.env): SmtpProperty {
        const missing = KeyUtils.getMissingKeys(env, REQUIRED);
        if (missing.length > 0) {
            throw new Error(`Faltan variables: ${missing.join(", ")}`);
        }

        return {
            host: env.SMTP_HOST!,
            port: Number(env.SMTP_PORT ?? 587),
            user: env.SMTP_USER!,
            pass: env.SMTP_PASS!,
            from: env.MAIL_FROM!
        };
    }
}