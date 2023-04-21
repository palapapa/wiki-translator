import path from "path";

console.log(path.resolve(__dirname, 'src/**/*.js'));

function Dropmenu_show(): void {
    document.getElementById("Dropdown")!.classList.toggle("show");
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
    document.getElementById('target-language-text')!.innerHTML = ("Target Language: " + language);
    if (language === "Auto detect") {
        document.getElementById('target-language-btn_text')!.innerHTML = "Detected Language";
    }
    else {
        document.getElementById('target-language-btn_text')!.innerHTML = language;
    }
}

// 開啟 target language 下拉選單
const btnOutPut = document.getElementById("dropbtnn")!;
btnOutPut.onclick = Dropmenu_show;

// 各語言選項
const target_auto = document.getElementById("auto")!;
target_auto.onclick = function () {
    Dropmenu_update("Auto detect");
};

const target_english = document.getElementById("english")!;
target_english.onclick = function () {
    Dropmenu_update("English");
};

const target_chinese = document.getElementById("chinese")!;
target_chinese.onclick = function () {
    Dropmenu_update("中文");
};

const target_spanish = document.getElementById("spanish")!;
target_spanish.onclick = function () {
    Dropmenu_update("Español");
};

const target_malayalam = document.getElementById("malayalam")!;
target_malayalam.onclick = function () {
    Dropmenu_update("മലയാളം");
};
