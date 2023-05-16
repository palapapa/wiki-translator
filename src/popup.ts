import { fetchAllLanguages } from "./articleFetcher";
import { getCurrentUrl } from "./urlUtilities";
import { WikiArticle } from "./wikiArticle";
import { supportedLanguages } from "./googleTranslateSupportedLanguages";

function dropmenuShow(): void {
    const dropdown = document.getElementById("dropdown");
    if (dropdown != null) {
        dropdown.classList.toggle("show");
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event: MouseEvent): void {
    if (event.target instanceof Element && !(event.target as Element).matches(".coverDropButton")) {
        const dropdowns = document.getElementsByClassName("dropdownContent");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown != undefined && openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

function dropmenuUpdate(language: string): void {
    const targetLanguageText = document.getElementById("targetLanguageText");
    if (targetLanguageText != null) {
        targetLanguageText.innerHTML = ("Target Language: " + language);
    }
    const targetLanguageButtonText = document.getElementById("targetLanguageButtonText");
    if (targetLanguageButtonText != null) {
        targetLanguageButtonText.innerHTML = language;
    }

}

// 開啟 target language 下拉選單
const outputButton = document.getElementById("dropButton");
if (outputButton != null) {
    outputButton.onclick = dropmenuShow;
}


// 語言選項
function createTargetLanguageList(): void {
    console.log("createTargetLanguageList");
    const dropdown = document.getElementById("dropdown");
    // const newSpan = document.createElement("span");

    // 遍歷清單並生成相應的項目
    for (let i = 0; i < supportedLanguages.length; i++) {
        const supportedLanguage = supportedLanguages[i];
        if (supportedLanguage != undefined) {
            const listItem = document.createElement("span");
            listItem.textContent = supportedLanguage.language;
            if (dropdown != undefined) {
                dropdown.appendChild(listItem);
            }
        }
    }
}


// 各語言選項

const targetEnglish = document.getElementById("english");
if (targetEnglish != null) {
    targetEnglish.onclick = function () {
        dropmenuUpdate("English");
    };
}

const targetChinese = document.getElementById("chinese");
if (targetChinese != null) {
    targetChinese.onclick = function () {
        dropmenuUpdate("中文");
    };
}

const targetSpanish = document.getElementById("spanish");
if (targetSpanish != null) {
    targetSpanish.onclick = function () {
        dropmenuUpdate("Español");
    };
}

const targetMalayalam = document.getElementById("malayalam");
if (targetMalayalam != null) {
    targetMalayalam.onclick = function () {
        dropmenuUpdate("മലയാളം");
    };
}

window.onload = async () => {
    createTargetLanguageList();
    const currentUrl = await getCurrentUrl();
    let wikiArticles: WikiArticle[] | null = null;
    if (currentUrl != null) {
        wikiArticles = await fetchAllLanguages(currentUrl);
        console.log(wikiArticles);
    }
};
