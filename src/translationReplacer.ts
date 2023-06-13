export interface TranslationReplacerMessage {
    html: string;
    sourceUrl: string;
}

chrome.runtime.onMessage.addListener(
    (message: TranslationReplacerMessage) => {
        document.getElementById("siteNotice")?.remove(); // This element causes the translated article to appear before the original one without replacing it and then it will completely cover the translated portion
        const content = document.getElementsByClassName("mw-parser-output")[0];
        if (content !== undefined) {
            content.innerHTML = message.html;
        }
    }
);
