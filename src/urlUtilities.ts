export { getCurrentUrl };

async function getCurrentUrl(): Promise<URL | null> {
    const urlString = (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]?.url;
    if (urlString == undefined) {
        return null;
    }
    return new URL(urlString);
}
