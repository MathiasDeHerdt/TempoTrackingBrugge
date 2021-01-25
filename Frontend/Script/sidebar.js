document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM - SIDEBAR');

    document.getElementById("js-button-open").addEventListener("click", function () {
        document.getElementById("myNav").style.transform = "translateX(0)";
    });

    document.getElementById("js-option-close").addEventListener("click", function () {
        document.getElementById("myNav").style.transform = "translateX(-100%)";
    });
});