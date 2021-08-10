export function FormatDate(src) {
    if (src === undefined)
        return "";
    var date = new Date(src)
    return date.toLocaleDateString("ru") + " " + date.toLocaleTimeString("ru")
}
