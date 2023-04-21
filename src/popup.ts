function Dropmenu_show(): void {
    const dropdown = document.getElementById("Dropdown");
    if (dropdown !== null) {
        dropdown.classList.toggle("show")
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event: MouseEvent): void {
    if (!(event.target as HTMLElement).matches('.cover_dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i] as HTMLElement;
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function Dropmenu_update(language: string): void {
    const targetLanguageText = document.getElementById('target-language-text');
    if (targetLanguageText !== null) {
        targetLanguageText.innerHTML = ("Target Language: " + language);
    }
    const targetLanguageBtnText = document.getElementById('target-language-btn_text');
    if (targetLanguageBtnText !== null) {
        if (language === "Auto detect") {
            targetLanguageBtnText.innerHTML = "Detected Language";
        }
        else {
            targetLanguageBtnText.innerHTML = language;
        }
    }
    
}

// 開啟 target language 下拉選單
const btnOutput = document.getElementById("dropbtnn");
if (btnOutput !== null) {
    btnOutput.onclick = Dropmenu_show;
}

// 各語言選項
const target_auto = document.getElementById("auto");
if (target_auto !== null) {
    target_auto.onclick = function () {
        Dropmenu_update("Auto detect");
    };
}

const target_english = document.getElementById("english");
if (target_english !== null) {
    target_english.onclick = function () {
        Dropmenu_update("English");
    };
}

const target_chinese = document.getElementById("chinese");
if (target_chinese !== null) {
    target_chinese.onclick = function () {
        Dropmenu_update("中文");
    };
}

const target_spanish = document.getElementById("spanish");
if (target_spanish !== null) {
    target_spanish.onclick = function () {
        Dropmenu_update("Español");
    };
}

const target_malayalam = document.getElementById("malayalam");
if (target_malayalam !== null) {
    target_malayalam.onclick = function () {
        Dropmenu_update("മലയാളം");
    };
}
