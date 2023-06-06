import { fetchAllLanguages } from "./articleFetcher";
import { translateArticles } from "./articleTranslator";
import { getCurrentUrl } from "./urlUtilities";
import { WikiArticle } from "./wikiArticle";
import { supportedLanguages, getFullNameFromCode } from "./googleTranslateSupportedLanguages";
import { TranslatedWikiArticle } from "./translatedWikiArticle";

export let selectedTargetLanguage = "";

function dropmenuShow(): void {
    const dropdown = document.getElementById("dropdown");
    if (dropdown !== null) {
        dropdown.classList.toggle("show");
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event: MouseEvent): void {
    if (event.target instanceof Element && !(event.target as Element).matches(".coverDropButton")) {
        const dropdowns = document.getElementsByClassName("dropdownContent");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown !== undefined && openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

function dropmenuUpdate(language: string): void {
    const targetLanguageText = document.getElementById("targetLanguageText");
    if (targetLanguageText !== null) {
        targetLanguageText.innerHTML = ("Target Language : " + language);
    }
}

// 開啟 target language 下拉選單
const outputButton = document.getElementById("dropButton");
if (outputButton !== null) {
    outputButton.onclick = dropmenuShow;
}

// 語言選項
function createTargetLanguageList(): void {
    console.log("createTargetLanguageList");
    const dropdown = document.getElementById("dropdown");

    // 遍歷清單並生成相應的項目
    for (let i = 0; i < supportedLanguages.length; i++) {
        const supportedLanguage = supportedLanguages[i];
        if (supportedLanguage !== undefined) {
            const listItem = document.createElement("span");
            listItem.textContent = supportedLanguage.language;
            if (supportedLanguage.codes[0] !== undefined) {
                listItem.setAttribute("id", supportedLanguage.codes[0]);
            }
            if (dropdown !== null) {
                dropdown.appendChild(listItem);
            }
        }
    }
}

// 各語言選項的點擊事件
function setLanguageOnClick(languageCode: string, language: string) {
    const targetElement = document.getElementById(languageCode);
    if (targetElement !== null) {
        targetElement.onclick = function () {
            dropmenuUpdate(language);
            selectedTargetLanguage = languageCode;
            console.log(`Currently selected language: ${languageCode}`);
        };
    }
}

function setLanguagesOnClick() {
    for (let i = 0; i < supportedLanguages.length; i++) {
        const supportedLanguage = supportedLanguages[i];
        if (supportedLanguage !== undefined) {
            const code = supportedLanguage.codes[0];
            if (code !== undefined) {
                setLanguageOnClick(code, supportedLanguage.language);
            }
        }
    }
}

function createTopThreeItem(translatedWikiArticle: TranslatedWikiArticle): HTMLElement {
    const topThreeItem = document.createElement("div");
    topThreeItem.className = "topThreeItem";
    topThreeItem.appendChild(
        document.createTextNode(getFullNameFromCode(translatedWikiArticle.language) ?? "<Error: Unknown Language>")
    );
    const icon = document.createElement("i");
    icon.className = "linkIcon";
    topThreeItem.appendChild(icon);
    return topThreeItem;
}

window.onload = async () => {
    createTargetLanguageList();
    setLanguagesOnClick();
    const currentUrl = await getCurrentUrl();
    let wikiArticles: WikiArticle[] | null = null;
    if (currentUrl !== null) {
        wikiArticles = await fetchAllLanguages(currentUrl);
        if (wikiArticles !== null) {
            const translatedWikiArticles: TranslatedWikiArticle[] = await translateArticles(wikiArticles, "zh-TW");
            console.log(translatedWikiArticles);
            translatedWikiArticles.sort((a, b) => b.length - a.length);
            const topLanguagesList = document.getElementById("topThreeItems");
            if (topLanguagesList !== null) {
                for (let i = 0; i < 3 && i < translatedWikiArticles.length; i++) {
                    const translatedWikiArticle = translatedWikiArticles[i];
                    if (translatedWikiArticle !== undefined) {
                        if (translatedWikiArticle.document === null) {
                            continue;
                        }
                        const topThreeItem = createTopThreeItem(translatedWikiArticle);
                        topLanguagesList.appendChild(topThreeItem);
                    }
                }
            }
        }
    }
};
