chrome.runtime.onMessage.addListener(
    (message: string) => {
        console.log("here");
        const content = document.getElementsByClassName("mw-parser-output")[0];
        if (content !== undefined) {
            content.innerHTML = message;
        }
    }
);
