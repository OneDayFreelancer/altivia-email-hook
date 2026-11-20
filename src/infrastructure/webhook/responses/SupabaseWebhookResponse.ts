export interface SupabaseWebhookResponse {
    user?: { email?: string };
    email_data?: {
        email_action_type?: string;
        token?: string;
        token_hash?: string;
        redirect_to?: string;
    };
}