function dropmenuShow(): void {
    const dropdown = document.getElementById("dropdown");
    if (dropdown !== null) {
        dropdown.classList.toggle("show")
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event: MouseEvent): void {
    if (!(event.target as HTMLElement).matches('.coverDropButton')) {
        const dropdowns = document.getElementsByClassName("dropdownContent");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i] as HTMLElement;
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function dropmenuUpdate(language: string): void {
    const targetLanguageText = document.getElementById('targetLanguageText');
    if (targetLanguageText !== null) {
        targetLanguageText.innerHTML = ("Target Language: " + language);
    }
    const targetLanguageButtonText = document.getElementById('targetLanguageButtonText');
    if (targetLanguageButtonText !== null) {
        if (language === "Auto detect") {
            targetLanguageButtonText.innerHTML = "Detected Language";
        }
        else {
            targetLanguageButtonText.innerHTML = language;
        }
    }
    
}

// 開啟 target language 下拉選單
const outputButton = document.getElementById("dropButton");
if (outputButton !== null) {
    outputButton.onclick = dropmenuShow;
}

// 各語言選項
const targetAuto = document.getElementById("auto");
if (targetAuto !== null) {
    targetAuto.onclick = function () {
        dropmenuUpdate("Auto detect");
    };
}

const targetEnglish = document.getElementById("english");
if (targetEnglish !== null) {
    targetEnglish.onclick = function () {
        dropmenuUpdate("English");
    };
}

const targetChinese = document.getElementById("chinese");
if (targetChinese !== null) {
    targetChinese.onclick = function () {
        dropmenuUpdate("中文");
    };
}

const targetSpanish = document.getElementById("spanish");
if (targetSpanish !== null) {
    targetSpanish.onclick = function () {
        dropmenuUpdate("Español");
    };
}

const targetMalayalam = document.getElementById("malayalam");
if (targetMalayalam !== null) {
    targetMalayalam.onclick = function () {
        dropmenuUpdate("മലയാളം");
    };
}
