import { LanglinksResponse, Langlink } from "./langlinksResponseTypes";
import { ParseResponse } from "./parseResponseTypes";
import { getWikiArticleLanguageCode } from "./urlUtilities";
import { WikiArticle } from "./wikiArticle";

function getTitle(url: URL): string | null {
    let title: string | undefined;
    const urlString = url.toString(),
        titleDelimiters = ["/wiki/", "/zh-tw/", "/zh-cn/", "/zh-hk/", "/zh-mo/", "/zh-my/", "/zh-sg/"];
    for (let i = 0; i < titleDelimiters.length && title === undefined; i++) {
        const delimiter = titleDelimiters[i];
        if (delimiter !== undefined) {
            title = urlString.split(delimiter)[1];
        }
    }
    if (title === undefined) { // If the title cannot be found
        return null;
    }
    return title.split("#")[0] ?? null; // Removes possible hash
}

function getQueryUrl(url: URL, params: URLSearchParams): URL {
    const queryUrl = new URL(url);
    queryUrl.pathname = "/w/api.php";
    queryUrl.search = params.toString();
    return queryUrl;
}

async function getHtml(url: URL): Promise<Document | null> {
    const title = getTitle(url);
    if (title === null) {
        return null;
    }
    const decodedTitle = decodeURI(title), // The title is converted back to unicode before using it in fetch. Otherwise fetch would encode the already percent encoded title again
        params = new URLSearchParams(
            {
                action: "parse",
                page: decodedTitle,
                redirects: "",
                format: "json",
                origin: "*"
            }
        ),
        queryUrl = getQueryUrl(url, params),
        response = await fetch(queryUrl);
    if (!response.ok) {
        return null;
    }
    const responseObject: ParseResponse = await response.json() as ParseResponse,
        htmlString = responseObject.parse?.text?.["*"];
    if (htmlString !== undefined) {
        return new DOMParser().parseFromString(htmlString, "text/html");
    }
    return null;
}

async function getLanglinks(url: URL): Promise<Langlink[] | null> {
    const title = getTitle(url);
    if (title === null) {
        return null;
    }
    const decodedTitle = decodeURI(title), // The title is converted back to unicode before using it in fetch. Otherwise fetch would encode the already percent encoded title again
        params = new URLSearchParams(
            {
                action: "query",
                prop: "langlinks",
                titles: decodedTitle,
                llprop: "url",
                lllimit: "max",
                redirects: "",
                format: "json",
                origin: "*"
            }
        ),
        queryUrl = getQueryUrl(url, params),
        response = await fetch(queryUrl);
    if (!response.ok) {
        return null;
    }
    const responseObject: LanglinksResponse = await response.json() as LanglinksResponse,
        pages = responseObject.query?.pages;
    if (pages === undefined) {
        return null;
    }
    let langlinks: Langlink[] | undefined = Object.values(pages)[0]?.langlinks;
    if (langlinks === undefined) { // If this article only has one language
        langlinks = [];
    }
    const currentLanguage = getWikiArticleLanguageCode(url);
    if (currentLanguage !== null) {
        langlinks.push({ lang: currentLanguage, url: url.toString(), "*": title });
    }
    return langlinks;
}

export async function fetchAllLanguages(url: URL): Promise<WikiArticle[] | null> {
    const langlinks = await getLanglinks(url);
    if (langlinks === null) {
        return null;
    }
    const result: WikiArticle[] = [], promises: Promise<Document | null>[] = [];
    for (const langlink of langlinks) {
        if (langlink.url !== undefined) {
            promises.push(getHtml(new URL(langlink.url)));
        }
    }
    const documents = await Promise.all(promises);
    for (let i = 0; i < documents.length; i++) {
        const document = documents[i],
            langlink = langlinks[i];
        if (document != null && langlink?.lang !== undefined) {
            result.push({ languageCode: langlink.lang, document: document });
        }
    }
    return result;
}
