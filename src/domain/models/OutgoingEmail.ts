import type {RenderedEmail} from "./RenderedEmail.js";

export interface OutgoingEmail extends RenderedEmail {
    to: string;
}