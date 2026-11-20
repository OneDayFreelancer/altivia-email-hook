import type { RenderedEmail } from "@/domain/models/RenderedEmail.js"
import type { AuthEmail } from "@/domain/models/AuthEmail.js"

export interface HtmlTemplatePort {
  render(email: AuthEmail): RenderedEmail
}
