export class HtmlUtils {
    static escapeHtml (value: string):string {
        return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
    }
}