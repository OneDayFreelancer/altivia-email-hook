import type {AuthEmail} from "@/domain/models/AuthEmail.js";
import {InvalidAuthEmailError} from "@/domain/exceptions/InvalidAuthEmailError.js";

export class EmailRequest {
    readonly to: string;
    readonly type: string;
    readonly token: string;
    readonly tokenHash: string;
    readonly redirectTo: string;

    constructor(props: AuthEmail) {
        if (!props.to) throw new InvalidAuthEmailError("Falta el destinatario");
        if (!props.type) throw new InvalidAuthEmailError("Falta el tipo de correo");

        this.to = props.to;
        this.type = props.type;
        this.token = props.token ?? "";
        this.tokenHash = props.tokenHash ?? "";
        this.redirectTo = props.redirectTo ?? "";
    }

    /** La reautenticación solo lleva un código; el resto lleva enlace. */
    get requiresLink(): boolean {
        return this.type !== "reauthentication";
    }
}