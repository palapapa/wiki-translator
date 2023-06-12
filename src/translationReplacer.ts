import { getStyles } from "./moduleFetcher";

chrome.runtime.onMessage.addListener(
    async (message: string) => {
        document.getElementById("siteNotice")?.remove(); // This element causes the translated article to appear before the original one without replacing it and then it will completely cover the translated portion
        const styles = await getStyles(new URL(location.href));
        if (styles !== null) {
            console.log("Added styles.");
            document.head.appendChild(styles);
        }
        else {
            console.log("Failed to add styles.");
        }
        const content = document.getElementsByClassName("mw-parser-output")[0];
        if (content !== undefined) {
            content.innerHTML = message;
        }
    }
);
