export class InvalidSignatureError extends Error {
  constructor() {
    super("Firma inválida")
    this.name = "InvalidSignatureError"
  }
}
