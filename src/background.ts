chrome.tabs.onHighlighted.addListener
(
    (highlightInfo) =>
    {
        if (highlightInfo.tabIds.length != 1)
        {
            return;
        }
        console.log(highlightInfo.tabIds[0]);
    }
)
