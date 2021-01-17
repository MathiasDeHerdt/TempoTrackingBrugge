const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

const script = function () {
    function timeToString(time) {
        let diffInHrs = time / 3600000;
        let hh = Math.floor(diffInHrs);

        let diffInMin = (diffInHrs - hh) * 60;
        let mm = Math.floor(diffInMin);

        let diffInSec = (diffInMin - mm) * 60;
        let ss = Math.floor(diffInSec);

        let diffInMs = (diffInSec - ss) * 100;
        let ms = Math.floor(diffInMs);

        let formattedMM = mm.toString().padStart(2, "0");
        let formattedSS = ss.toString().padStart(2, "0");
        let formattedMS = ms.toString().padStart(2, "0");

        return `${formattedMM}:${formattedSS}:${formattedMS}`;
    }

    // Declare variables to use in our functions below

    let startTime;
    let elapsedTime = 0;
    let timerInterval;

    // mathias variables
    let playButtonMain = document.getElementById('playButtonMain');
    let playButton = document.getElementById("playButton");

    let pauseButton = document.getElementById("pauseButton");
    let retryButton = document.getElementById("Retry_button");
    let endButton = document.getElementById('End_button');

    let gridButtons = document.getElementById("c-buttons_mainPage");

    let startGame = document.getElementById('startGameButton');
    let infoText = document.getElementById('infoText');

    // end mathias variables

    // Create function to modify innerHTML

    function print(txt) {
        document.getElementById("display").innerHTML = txt;
    }

    // Create "start", "pause" and "reset" functions

    // dan tonen we op de website een countdown van 10sec
    // dat is hoelang het duurt voor de ledstrip van rood naar groen te gaan
    function countdown() {
        console.log("Game starts in 10 seconds")

        const startTimer = 'start!';
        socket.emit('F2B_start_timer', startTimer)

        setTimeout(start, 2000) // staat nu op 2sec om te testen
    }

    // na de countdown kunnen we effectief gaan de tijd gaan beginnen timen
    function start() {
        console.log("Start the timer")
        playButtonMain.classList.remove("o-hide")

        showButtons()

        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            print(timeToString(elapsedTime));
        }, 10);
        showButton("Stop the timer");
    }

    function pause() {
        console.log("Stop the timer")

        clearInterval(timerInterval);
        showButton("PLAY");
    }

    function reset() {
        console.log("Reset")

        playButtonMain.classList.add("o-hide")

        clearInterval(timerInterval);
        print("00:00:00");
        elapsedTime = 0;
        hideButtons()
    }

    // Create function to display buttons

    function showButton(buttonKey) {
        const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
        const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;

        buttonToShow.style.display = "block";
        buttonToHide.style.display = "none";
    }
    // Create event listeners


    //let resetButton = document.getElementById("resetButton");

    playButton.addEventListener("click", start);
    pauseButton.addEventListener("click", pause);
    endButton.addEventListener('click', reset)
    //resetButton.addEventListener("click", reset);


    // #endregion

    // #region ===== Buttons  (start and retry)
    function showButtons() {
        console.log("Showing buttons")

        gridButtons.classList.remove("o-hide")
    }

    function hideButtons() {
        console.log("hiding buttons")

        gridButtons.classList.add("o-hide")
    }

    function Retry() {
        console.log("Retry")

        gridButtons.classList.add("o-hide")
        playButtonMain.classList.add("o-hide")

        clearInterval(timerInterval);
        print("00:00:00");
        elapsedTime = 0;

        countdown()
    }

    // playButton.addEventListener("click", showButtons);
    retryButton.addEventListener("click", Retry);
    //#endregion

    // start game button
    document.getElementById('startGameButton').onclick = function () {
        // elementen tonen en verbergen
        startGame.classList.add("o-hide")
        infoText.classList.add("o-hide")

        countdown()
    };

};

// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM - Main Page")

    script()
});
