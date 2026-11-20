import type { AuthEmail } from "@/domain/models/AuthEmail.js"
import type { RenderedEmail } from "@/domain/models/RenderedEmail.js"

export interface HtmlTemplatePort {
  render(email: AuthEmail): RenderedEmail
}
