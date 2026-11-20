export class InvalidAuthEmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidAuthEmailError";
    }
}