import type {AuthEmail} from "@/domain/models/AuthEmail.js";
import type {SupabaseWebhookResponse} from "@/infrastructure/webhook/responses/SupabaseWebhookResponse.js";

export class SupabaseWebhookMapper {
    static toAuthEmail(payload: unknown): AuthEmail {
        const { user, email_data: data } = (payload ?? {}) as SupabaseWebhookResponse;
        return {
            to: user?.email,
            type: data?.email_action_type,
            token: data?.token,
            tokenHash: data?.token_hash,
            redirectTo: data?.redirect_to,
        };
    }
}