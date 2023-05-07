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

async function checkIfOnWikipedia(): Promise<void> {
    const url = await getCurrentUrl();
    console.log(`Current URL: ${url}`);
    if (url != null) {
        const hostname = url.hostname.toString();
        if (hostname.substring(hostname.indexOf(".") + 1) == "wikipedia.org") {
            chrome.action.enable();
            console.log(url.hostname.toString(), "Enabled");
        }
        else {
            chrome.action.disable();
            console.log(url.hostname.toString(), "Disabled");
        }
    }
}

chrome.runtime.onInstalled.addListener(() => console.log("onInstalled fired"));
chrome.runtime.onInstalled.addListener(checkIfOnWikipedia);

chrome.runtime.onStartup.addListener(() => console.log("onStartup fired"));
chrome.runtime.onStartup.addListener(checkIfOnWikipedia);

chrome.tabs.onActivated.addListener(() => console.log("onActivated fired"));
chrome.tabs.onActivated.addListener(checkIfOnWikipedia);

chrome.tabs.onUpdated.addListener(() => console.log("onUpdated fired"));
chrome.tabs.onUpdated.addListener(checkIfOnWikipedia);

chrome.windows.onFocusChanged.addListener(() => console.log("onFocusChanged fired"));
chrome.windows.onFocusChanged.addListener(checkIfOnWikipedia);
