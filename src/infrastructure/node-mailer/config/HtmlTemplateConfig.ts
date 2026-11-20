import type {
    HtmlTemplateProperties
} from "@/infrastructure/node-mailer/config/HtmlTemplateProperties.js";
import {KeyUtils} from "@/shared/utils/KeyUtils.js";

const REQUIRED = [
    "SUPABASE_URL",
] as const;

export class HtmlTemplateConfig {
    static loadConfig(env: NodeJS.ProcessEnv = process.env): HtmlTemplateProperties {
        const missing = KeyUtils.getMissingKeys(env, REQUIRED);
        if (missing.length > 0) {
            throw new Error(`Faltan variables: ${missing.join(", ")}`);
        }

        return {
            supabaseUrl: env.SUPABASE_URL!,
        };
    }
}