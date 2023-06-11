chrome.runtime.onMessage.addListener(
    (message: Document) => {
        const content = document.getElementsByClassName("mw-parser-output")[0],
            contentToReplace = message.getElementsByClassName("mw-parser-output")[0];
        if (content !== undefined && contentToReplace !== undefined) {
            content.innerHTML = contentToReplace.innerHTML;
        }
    }
);
