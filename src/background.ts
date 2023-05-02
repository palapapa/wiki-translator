import { getCurrentUrl } from "./urlUtilities";

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
    const url = await getCurrentUrl();
    if (url != null)
    {
        const hostname = url.hostname.toString();
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
chrome.runtime.onStartup.addListener(checkIfOnWikipedia);
chrome.tabs.onActivated.addListener(checkIfOnWikipedia);
