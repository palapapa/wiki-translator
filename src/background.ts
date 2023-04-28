/*
chrome.declarativeContent.onPageChanged.removeRules
(
    () =>
    {
        chrome.declarativeContent.onPageChanged.addRules
        (
            [
                {
                    conditions:
                    [
                        new chrome.declarativeContent.PageStateMatcher
                        (
                            {
                                pageUrl:
                                {
                                    hostSuffix: "wikipedia.org"
                                }
                            }
                        )
                    ],
                    actions:
                    [
                        new chrome.declarativeContent.ShowAction()
                    ]
                }
            ]
        )
    }
)
*/

async function checkIfOnWikipedia(): Promise<void>
{
    let tabs = await chrome.tabs.query({active: true});
    if (tabs[0]?.url != undefined)
    {
        let hostname = new URL(tabs[0].url).hostname.toString();
        if (hostname.substring(hostname.indexOf(".") + 1) == "wikipedia.org")
        {
            chrome.action.enable();
        }
        else
        {
            chrome.action.disable();
        }
    }
}

chrome.runtime.onInstalled.addListener(checkIfOnWikipedia);
chrome.tabs.onActivated.addListener(checkIfOnWikipedia);
