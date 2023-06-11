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
