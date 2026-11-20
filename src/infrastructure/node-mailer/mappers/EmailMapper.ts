import {EmailRequest} from "@/infrastructure/node-mailer/requests/EmailRequest.js";
import type {AuthEmail} from "@/domain/models/AuthEmail.js";

export class EmailMapper {
    static mapToEmailRequest(authEmail: AuthEmail): EmailRequest {
        return new EmailRequest(authEmail);
    }
}