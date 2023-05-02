export { fetchAllLanguages };

function getTitle(url: URL): string | null
{
    let title: string | undefined = undefined;
    const urlString = url.toString();
    const titleDelimiters = ["/wiki/", "/zh-tw/", "/zh-cn/", "/zh-hk/", "/zh-mo/", "/zh-my/", "/zh-sg/"];
    for (let i = 0; i < titleDelimiters.length && title == undefined; i++)
    {
        const delimiter = titleDelimiters[i];
        if (delimiter != undefined)
        {
            title = urlString.split(delimiter)[1];
        }
    }
    if (title == undefined) // If the title cannot be found
    {
        return null;
    }
    return title;
}

async function fetchAllLanguages(url: URL): Promise<[string, Document][] | null>
{
    const title = getTitle(url);
    const language = url.hostname.split(".")[0];
    if (title == null)
    {
        return null;
    }
    const params = new URLSearchParams
    (
        {
            action: "query",
            prop: "langlinks",
            titles: title,
            llprop: "url",
            lllimit: "max",
            redirects: "",
            format: "json"
        }
    ).toString();
    const queryUrl = new URL(url);
    queryUrl.pathname = "/w/api.php";
    queryUrl.search = params.toString();
    const query = await (await fetch(queryUrl)).json();
    console.log(query);
    return null;
}
