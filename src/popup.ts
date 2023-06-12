import { fetchAllLanguages } from "./articleFetcher";
import { translateArticles } from "./articleTranslator";
import { getCurrentUrl, getWikiArticleLanguageCode } from "./urlUtilities";
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

function dropmenuUpdateWithLanguageCode(languageCode: string): boolean {
    const language = getFullNameFromCode(languageCode);
    if (language === null) {
        return false;
    }
    dropmenuUpdate(language);
    console.log(`Currently selected language: ${languageCode}`);
    return true;
}

async function selectLanguage(languageCode: string): Promise<boolean> {
    const isSuccess = dropmenuUpdateWithLanguageCode(languageCode);
    if (isSuccess) {
        selectedTargetLanguage = languageCode;
        await addTop3LanguageButtons(languageCode);
    }
    return isSuccess;
}

// 各語言選項的點擊事件
function setLanguageOnClick(languageCode: string): void {
    const targetElement = document.getElementById(languageCode);
    if (targetElement !== null) {
        targetElement.onclick = () => selectLanguage(languageCode);
    }
}

function setLanguagesOnClick(): void {
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
        document.createTextNode(getFullNameFromCode(translatedWikiArticle.languageCode) ?? "<Error: Unknown Language>")
    );
    const icon = document.createElement("img");
    icon.className = "linkIcon";
    icon.setAttribute("src", "../images/link.svg");
    topThreeItem.appendChild(icon);
    return topThreeItem;
}

function filterTranslatedWikiArticles(translatedWikiArticles: TranslatedWikiArticle[], currentLanguageCode: string): TranslatedWikiArticle[] {
    const currentLanguageArticle = translatedWikiArticles.find(article => article.languageCode === currentLanguageCode);
    if (currentLanguageArticle === undefined) {
        return translatedWikiArticles;
    }
    return translatedWikiArticles.filter(article => article.length >= currentLanguageArticle.length && article.languageCode !== currentLanguageCode);
}

async function addTop3LanguageButtons(languageCode: string): Promise<void> {
    try {
        const loadingIcon: HTMLTemplateElement | null = document.getElementById("loadingIconTemplate") as HTMLTemplateElement | null;
        if (loadingIcon === null) {
            return;
        }
        const loadingIconDiv = loadingIcon.content.cloneNode(true);
        document.getElementById("topThreeItems")?.appendChild(loadingIconDiv);
        const currentUrl = await getCurrentUrl();
        let wikiArticles: WikiArticle[] | null = null;
        if (currentUrl === null) {
            return;
        }
        wikiArticles = await fetchAllLanguages(currentUrl);
        if (wikiArticles === null) {
            return;
        }
        let translatedWikiArticles: TranslatedWikiArticle[] = await translateArticles(wikiArticles, languageCode);
        translatedWikiArticles = filterTranslatedWikiArticles(translatedWikiArticles, languageCode);
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
            }
        }
    }
    finally {
        document.getElementById("loadingIconCenterer")?.remove();
    }
}

window.onload = async () => {
    createTargetLanguageList();
    setLanguagesOnClick();
    const currentUrl = await getCurrentUrl();
    if (currentUrl === null) {
        return;
    }
    const currentLanguage = getWikiArticleLanguageCode(currentUrl);
    if (currentLanguage === null) {
        return;
    }
    await selectLanguage(currentLanguage);
};
