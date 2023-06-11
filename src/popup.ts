import { fetchAllLanguages } from "./articleFetcher";
import { translateArticles } from "./articleTranslator";
import { getCurrentUrl, getWikiArticleLanguage } from "./urlUtilities";
import { WikiArticle } from "./wikiArticle";
import { supportedLanguages, getFullNameFromCode } from "./googleTranslateSupportedLanguages";
import { TranslatedWikiArticle } from "./translatedWikiArticle";

export let selectedTargetLanguage: string | null = null;

function dropmenuShow(): void {
    const dropdown = document.getElementById("dropdown");
    if (dropdown !== null) {
        dropdown.classList.toggle("show");
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event: MouseEvent): void {
    if (event.target instanceof Element && !event.target.matches(".coverDropButton")) {
        const dropdowns = document.getElementsByClassName("dropdownContent");
        for (const openDropdown of dropdowns) {
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

function dropmenuUpdate(language: string): void {
    const targetLanguageText = document.getElementById("targetLanguageText");
    if (targetLanguageText !== null) {
        targetLanguageText.innerHTML = "Target Language : " + language;
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
    for (const supportedLanguage of supportedLanguages) {
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

function selectLanguage(languageCode: string): void {
    const language = getFullNameFromCode(languageCode);
    if (language === null) {
        return;
    }
    dropmenuUpdate(language);
    selectedTargetLanguage = languageCode;
    console.log(`Currently selected language: ${languageCode}`);
}

// 各語言選項的點擊事件
function setLanguageOnClick(languageCode: string): void {
    const targetElement = document.getElementById(languageCode);
    if (targetElement !== null) {
        targetElement.onclick = () => selectLanguage(languageCode);
    }
}

function setLanguagesOnClick() {
    for (const supportedLanguage of supportedLanguages) {
        const code = supportedLanguage.codes[0];
        if (code !== undefined) {
            setLanguageOnClick(code);
        }
    }
}

function createTopThreeItem(translatedWikiArticle: TranslatedWikiArticle): HTMLElement {
    const topThreeItem = document.createElement("div");
    topThreeItem.className = "topThreeItem";
    topThreeItem.appendChild(
        document.createTextNode(getFullNameFromCode(translatedWikiArticle.language) ?? "<Error: Unknown Language>")
    );
    const icon = document.createElement("img");
    icon.className = "linkIcon";
    icon.setAttribute("src", "../images/link.svg");
    topThreeItem.appendChild(icon);
    return topThreeItem;
}

window.onload = async () => {
    createTargetLanguageList();
    setLanguagesOnClick();
    const currentUrl = await getCurrentUrl();
    let wikiArticles: WikiArticle[] | null = null;
    if (currentUrl === null) {
        return;
    }
    const currentLanguage = getWikiArticleLanguage(currentUrl);
    if (currentLanguage === null) {
        return;
    }
    selectLanguage(currentLanguage);
    wikiArticles = await fetchAllLanguages(currentUrl);
    if (wikiArticles === null) {
        return;
    }
    const translatedWikiArticles: TranslatedWikiArticle[] = await translateArticles(wikiArticles, "zh-TW");
    console.log(translatedWikiArticles);
    translatedWikiArticles.sort((a, b) => b.length - a.length);
    const topLanguagesList = document.getElementById("topThreeItems");
    if (topLanguagesList === null) {
        return;
    }
    for (let i = 0; i < 3 && i < translatedWikiArticles.length; i++) {
        const translatedWikiArticle = translatedWikiArticles[i];
        if (translatedWikiArticle !== undefined) {
            if (translatedWikiArticle.document === null) {
                continue;
            }
            const topThreeItem = createTopThreeItem(translatedWikiArticle);
            topLanguagesList.appendChild(topThreeItem);
            document.getElementById("loadingIconCenterer")?.remove();
        }
    }
};
