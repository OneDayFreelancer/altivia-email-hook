import {KeyUtils} from "@/shared/utils/KeyUtils.js";
import type {WebhookProperty} from "@/infrastructure/webhook/config/WebhookProperty.js";

const REQUIRED = [
    "SEND_EMAIL_HOOK_SECRET",
] as const;

export class WebhookConfig{
    static loadConfig(env: NodeJS.ProcessEnv = process.env): WebhookProperty {
        const missing = KeyUtils.getMissingKeys(env, REQUIRED);
        if (missing.length > 0) {
            throw new Error(`Faltan variables: ${missing.join(", ")}`);
        }

        return {
            secret: env.SEND_EMAIL_HOOK_SECRET!,
        };
    }
}