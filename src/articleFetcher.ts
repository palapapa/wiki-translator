import { LanglinksResponse, Langlink } from "./langlinksResponseTypes";
import { ParseResponse } from "./parseResponseTypes";
import { WikiArticle } from "./wikiArticle";

function getTitle(url: URL): string | null {
    let title: string | undefined;
    const urlString = url.toString();
    const titleDelimiters = ["/wiki/", "/zh-tw/", "/zh-cn/", "/zh-hk/", "/zh-mo/", "/zh-my/", "/zh-sg/"];
    for (let i = 0; i < titleDelimiters.length && title == undefined; i++) {
        const delimiter = titleDelimiters[i];
        if (delimiter != undefined) {
            title = urlString.split(delimiter)[1];
        }
    }
    if (title == undefined) { // If the title cannot be found
        return null;
    }
    return title;
}

function getQueryUrl(url: URL, params: URLSearchParams): URL {
    const queryUrl = new URL(url);
    queryUrl.pathname = "/w/api.php";
    queryUrl.search = params.toString();
    return queryUrl;
}

async function getHtml(url: URL): Promise<Document | null> {
    const title = getTitle(url);
    if (title == null) {
        return null;
    }
    const decodedTitle = decodeURI(title); // The title is converted back to unicode before using it in fetch. Otherwise fetch would encode the already percent encoded title again
    const params = new URLSearchParams(
        {
            action: "parse",
            page: decodedTitle,
            redirects: "",
            format: "json",
            origin: "*"
        }
    );
    const queryUrl = getQueryUrl(url, params);
    const response = await fetch(queryUrl);
    if (!response.ok) {
        return null;
    }
    const responseObject: ParseResponse = await response.json();
    return (new DOMParser).parseFromString(responseObject.parse.text["*"], "text/html");
}

async function getLanglinks(url: URL): Promise<Langlink[] | null> {
    const title = getTitle(url);
    if (title == null) {
        return null;
    }
    const decodedTitle = decodeURI(title); // The title is converted back to unicode before using it in fetch. Otherwise fetch would encode the already percent encoded title again
    const params = new URLSearchParams(
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
    );
    const queryUrl = getQueryUrl(url, params);
    const response = await fetch(queryUrl);
    if (!response.ok) {
        return null;
    }
    const responseObject: LanglinksResponse = await response.json();
    const page = responseObject.query.pages[0];
    return page != undefined ? page.langlinks : null;
}

export async function fetchAllLanguages(url: URL): Promise<WikiArticle[] | null> {
    const langlinks = await getLanglinks(url);
    if (langlinks == null) {
        return null;
    }
    const result: WikiArticle[] = [];
    for (let i = 0; i < langlinks.length; i++) {
        const langlink = langlinks[i];
        
        if (langlink != undefined) {
            const html = await getHtml(new URL(langlink.url));
            if (html != null) {
                result.push({ language: langlink.lang, document: html });
            }
        }
    }
    return result;
}
