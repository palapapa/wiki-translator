function Dropmenu_show() {
    document.getElementById("Dropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.cover_dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function Dropmenu_update(language) {
    document.getElementById('target-language-text').innerHTML = ("Target Language: " + language);
    if (language === "Auto detect") {
        document.getElementById('target-language-btn_text').innerHTML = "Detected Language";
    }
    else {
        document.getElementById('target-language-btn_text').innerHTML = language;
    }


}

//開啟target language下拉選單
let btnOutPut = document.getElementById("dropbtnn");
btnOutPut.onclick = Dropmenu_show;


// 各語言選項
let target_auto = document.getElementById("auto");
target_auto.onclick = function () {
    Dropmenu_update("Auto detect");
};

let target_english = document.getElementById("english");
target_english.onclick = function () {
    Dropmenu_update("English");
};

let target_chinese = document.getElementById("chinese");
target_chinese.onclick = function () {
    Dropmenu_update("中文");
};

let target_spanish = document.getElementById("spanish");
target_spanish.onclick = function () {
    Dropmenu_update("Español");
};

let target_malayalam = document.getElementById("malayalam");
target_malayalam.onclick = function () {
    Dropmenu_update("മലയാളം");
};