import type { OutgoingEmail } from "@/domain/models/OutgoingEmail.js"

export interface MailerPort {
  send(email: OutgoingEmail): Promise<void>
}
