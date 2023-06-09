export async function getCurrentUrl(): Promise<URL | null> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) {
        console.log("Tab query did not find any tabs");
    }
    const urlString = tabs[0]?.url;
    if (urlString === undefined) {
        return null;
    }
    console.log(`getCurrentUrl: ${urlString}`);
    try {
        return new URL(urlString);
    }
    catch (e) {
        return null;
    }
}

export async function getCurrentTabId(): Promise<number | null> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0]?.id ?? null;
}

export function getWikiArticleLanguageCode(url: URL): string | null {
    if (!url.hostname.endsWith("wikipedia.org")) {
        return null;
    }
    return url.hostname.split(".")[0] ?? null;
}
