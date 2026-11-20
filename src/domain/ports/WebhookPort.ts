import type {AuthEmail} from "@/domain/models/AuthEmail.js";

export interface WebhookPort {
    verify(body: string, headers: Record<string, string>): AuthEmail;
}