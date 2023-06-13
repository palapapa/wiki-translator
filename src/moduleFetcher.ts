import { getQueryUrl, getTitle } from "./articleFetcher";
import { ParseResponse } from "./parseResponseTypes";
import { getWikiArticleLanguageCode } from "./urlUtilities";

export async function getStyles(url: URL): Promise<HTMLLinkElement | null> {
    let title = getTitle(url);
    if (title === null) {
        return null;
    }
    title = decodeURI(title);
    const params = new URLSearchParams(
            {
                action: "parse",
                page: title,
                redirects: "",
                format: "json",
                origin: "*",
                prop: "modules|jsconfigvars"
            }
        ),
        response = await fetch(getQueryUrl(url, params));
    if (!response.ok) {
        return null;
    }
    const responseObject: ParseResponse = await response.json() as ParseResponse,
        moduleStyles = responseObject.parse?.modulestyles;
    if (moduleStyles === undefined) {
        return null;
    }
    const result = document.createElement("link");
    result.rel = "stylesheet";
    result.href = `//${url.host}/w/load.php?debug=false&lang=${getWikiArticleLanguageCode(url)}&modules=${moduleStyles.join("|")}&only=styles`;
    return result;
}
