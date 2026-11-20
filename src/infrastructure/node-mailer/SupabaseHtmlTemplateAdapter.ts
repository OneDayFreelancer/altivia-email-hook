import type {HtmlTemplatePort} from "@/domain/ports/HtmlTemplatePort.js";
import type {AuthEmail} from "@/domain/models/AuthEmail.js";
import type {RenderedEmail} from "@/domain/models/RenderedEmail.js";
import {HtmlUtils} from "@/infrastructure/node-mailer/utils/HtmlUtils.js";
import {EmailMapper} from "@/infrastructure/node-mailer/mappers/EmailMapper.js";
import type {HtmlTemplateProperties} from "@/infrastructure/node-mailer/config/HtmlTemplateProperties.js";

const SUBJECTS: Record<string, string> = {
    signup: "Confirma tu correo",
    recovery: "Restablece tu contraseña",
    magiclink: "Tu enlace de acceso",
    invite: "Te invitaron a Altivia",
    email_change: "Confirma tu nuevo correo",
    reauthentication: "Tu código de verificación",
};

export class SupabaseHtmlTemplateAdapter implements HtmlTemplatePort {
    constructor(private readonly options: HtmlTemplateProperties) {}
    render(authEmail: AuthEmail): RenderedEmail {
        const email = EmailMapper.mapToEmailRequest(authEmail);
        const subject = SUBJECTS[email.type] ?? "Notificación de Altivia";

        if (!email.requiresLink) {
            return {
                subject,
                text: `Tu código es: ${email.token}`,
                html: `<p>Tu código es: <strong>${HtmlUtils.escapeHtml(email.token)}</strong></p>`,
            };
        }

        const link =
            `${this.options.supabaseUrl}/auth/v1/verify` +
            `?token=${encodeURIComponent(email.tokenHash)}` +
            `&type=${encodeURIComponent(email.type)}` +
            `&redirect_to=${encodeURIComponent(email.redirectTo)}`;

        return {
            subject,
            text: `Continuar: ${link}\nO usa este código: ${email.token}`,
            html:
                `<p><a href="${HtmlUtils.escapeHtml(link)}">Continuar</a></p>` +
                `<p>O usa este código: <strong>${HtmlUtils.escapeHtml(email.token)}</strong></p>`,
        };
    }
}