const button = function(){
    document.getElementById("continueButton").onclick = function () {
        location.href = "SettingsPage.html";
    };
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM - WelcomePage');

    button()
});