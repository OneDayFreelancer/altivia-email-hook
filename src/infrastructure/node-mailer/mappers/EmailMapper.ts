import type { AuthEmail } from "@/domain/models/AuthEmail.js"
import { EmailRequest } from "@/infrastructure/node-mailer/requests/EmailRequest.js"

export const EmailMapper = {
  mapToEmailRequest(authEmail: AuthEmail): EmailRequest {
    return new EmailRequest(authEmail)
  },
}
