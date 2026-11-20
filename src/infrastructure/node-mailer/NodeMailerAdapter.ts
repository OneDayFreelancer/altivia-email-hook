import type {SmtpProperty} from "@/infrastructure/node-mailer/config/SmtpProperty.js";
import type {MailerPort} from "@/domain/ports/MailerPort.js";
import type {OutgoingEmail} from "@/domain/models/OutgoingEmail.js";
import { createTransport, type Transporter } from "nodemailer";

export class NodeMailerAdapter implements MailerPort {
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor(config: SmtpProperty) {
        this.from = config.from;
        this.transporter = createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465,
            auth: { user: config.user, pass: config.pass },
        });
    }

    async send({ to, subject, html, text }: OutgoingEmail): Promise<void> {
        await this.transporter.sendMail({ from: this.from, to, subject, html, text });
    }
}