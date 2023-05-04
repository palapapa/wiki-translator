export { fetchAllLanguages };
import type { Langlink, Page } from "./mediawikiTypes";

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

async function fetchAllLanguages(url: URL): Promise<[string, Document][] | null> {
    const title = getTitle(url);
    const currentLanguage = url.hostname.split(".")[0];
    if (title == null) {
        return null;
    }
    const decodedTitle = decodeURI(title); // The title is converted back to unicode before using it in fetch. Otherwise fetch would encode the already percent encoded title again
    console.log(`Current title: ${decodedTitle}`);
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
    ).toString();
    const queryUrl = new URL(url);
    queryUrl.pathname = "/w/api.php";
    queryUrl.search = params.toString();
    const response = await fetch(queryUrl);
    if (!response.ok) {
        return null;
    }
    const responseObject = await response.json();
    const langlinks = (Object.values(responseObject.query.pages)[0] as Page).langlinks;
    let result: [string, Document][];
    
}
