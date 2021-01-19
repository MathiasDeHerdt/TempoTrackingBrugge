// INFO!
//
// ##### -> start codeblock
// @@@@@ -> end codeblock
// // -> info about codeblock
//
// INFO!

const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

// ##### Globale variabelen #####
var globalPlayerCount = 0
var globalEtappeCount = 0
var globalPlayerName = ""
var globalTeamName = ""

let counter = 0
let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")
var list = [];

// @@@@@ Globale variabelen @@@@@


// ##### Socket fuction for communication between front and back #####
const socketsFuction = function () {
    // Get data about the PLAYERS from the backend
    socket.on('B2F_player_settings', function (dataPlayer) {
        console.log(dataPlayer)

        // fill the global variables with data
        globalPlayerName = dataPlayer.Playername
        globalTeamName = dataPlayer.Teamname
    })

    // Get data about the GAME from the backend
    socket.on('B2F_game_settings', function (dataGame) {
        console.log(dataGame)

        // fill the global variables with data
        globalPlayerCount = dataGame.Playercount
        globalEtappeCount = dataGame.Etappecount
    })
}

// @@@@@ Socket fuction for communication between front and back @@@@@

// ##### Main script for the mainpage
const scriptFunction = function () {
    // ##### Variables #####
    let counter = 0
    let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")
    var list = [];

    let startTime;
    let elapsedTime = 0;
    let timerInterval;

    // Elements by ID
    let playButtonMain = document.getElementById('playButtonMain');
    let playButton = document.getElementById("playButton");
    let pauseButton = document.getElementById("pauseButton");
    let retryButton = document.getElementById("Retry_button");
    let endButton = document.getElementById('End_button');
    let gridButtons = document.getElementById("c-buttons_mainPage");
    let startGame = document.getElementById('startGameButton');
    let infoText = document.getElementById('infoText');

    // Queryselectors
    const a1 = document.querySelector("#a1");
    const a2 = document.querySelector("#a2");

    // Eventlisteners
    a1.addEventListener("click", SelectOption2);
    a2.addEventListener("click", SelectOption1);
    playButton.addEventListener("click", start);
    pauseButton.addEventListener("click", pause);
    endButton.addEventListener('click', reset)
    retryButton.addEventListener("click", Retry);
    // @@@@@ variables @@@@@

    // ##### Dropdown up / down animation #####
    function Dropdown() {
        counter += 1;

        if (counter == 1) {
            wrapperdropdown.classList.add("active");
            let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
            arrow.style.transform = "rotate(180deg)"
        }

        if (counter == 2) {
            wrapperdropdown.classList.remove("active");
            let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
            arrow.style.transform = "rotate(0deg)"
            counter = 0;
        }
    }
    wrapperdropdown.addEventListener("click", Dropdown)

    // @@@@@ Dropdown up / down animation @@@@@

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

    function print(txt) {
        document.getElementById("display").innerHTML = txt;
    }

    // ##### The game buttons #####
    // Countdown - in 10sec the game will start
    function countdown() {
        const startTimer = 'start!';
        // send message to backend that the game is about to start
        // will activate the led
        socket.emit('F2B_start_timer', startTimer)

        setTimeout(start, 2000) // Now 2sec for testing
    }

    // Start the timer
    function start() {
        let html = document.querySelector(".js-etappes");
        html.innerHTML = extraHTML();

        playButtonMain.classList.remove("o-hide")

        showButtons()

        startTime = Date.now() - elapsedTime;

        timerInterval = setInterval(function printTime() {
            elapsedTime = Date.now() - startTime;
            print(timeToString(elapsedTime));
        }, 10);

        showButton("Stop the timer");
    }

    // Pause the timer
    function pause() {
        clearInterval(timerInterval);
        showButton("PLAY");
    }

    // Restarts the game
    function Retry() {
        console.log("Retry")

        gridButtons.classList.add("o-hide")
        playButtonMain.classList.add("o-hide")

        clearInterval(timerInterval);
        print("00:00:00");
        elapsedTime = 0;

        countdown()
    }

    // Reset the timer (and game)
    function reset() {
        playButtonMain.classList.add("o-hide")

        clearInterval(timerInterval);
        print("00:00:00");
        elapsedTime = 0;

        hideButtons()
    }

    // Show the start and stop button
    function showButton(buttonKey) {
        const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
        const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;

        buttonToShow.style.display = "block";
        buttonToHide.style.display = "none";
    }

    // Shows the retry and end button
    function showButtons() {
        console.log("Showing buttons")

        gridButtons.classList.remove("o-hide")
    }

    // Hides the retry and end button
    function hideButtons() {
        console.log("hiding buttons")

        gridButtons.classList.add("o-hide")
    }
    // @@@@@ The game buttons @@@@@

    // ##### Dropdown selection #####
    function SelectOption1() {
        const a1 = document.querySelector("#a1");
        const a0 = document.querySelector("#a0");

        if (a0 != a1) {
            let savedWord1 = a0.textContent;
            a0.innerHTML = a1.textContent;
            a1.innerHTML = savedWord1;
        }

        let html = document.querySelector(".js-etappes");
        html.innerHTML = extraHTML();
    }

    function SelectOption2() {
        const a1 = document.querySelector("#a1");
        const a0 = document.querySelector("#a0");

        if (a0 != a2) {
            let savedWord2 = a0.textContent;
            a0.innerHTML = a2.textContent;
            a2.innerHTML = savedWord2;
        }

        let html = document.querySelector(".js-etappes");
        html.innerHTML = extraHTML();
    }

    document.getElementById('startGameButton').onclick = function () {
        // elementen tonen en verbergen
        startGame.classList.add("o-hide")
        infoText.classList.add("o-hide")

        countdown()
    };
    // @@@@@ Dropdown selection @@@@@

    // ##### Dynamic extra html for etappes #####
    const extraHTML = function () {
        let html = "";
        for (let etappe = 1; etappe <= globalEtappeCount; etappe++) {
            let teller = 0;
            html = html + `<div class="c-etappe__${globalPlayerCount}">
                <div class="c-etappe__card">
                  <div class="c-etappe__title">
                      <p class="c-E1">Etappe ${etappe}</p>
                  </div>
                  <div class="c-etappe__playersTotal">
                    <div class="c-etappe_player">
                      <div class="c-etappe_player__nameIcon">
                          `;
            for (let player of globalPlayerName) {
                html = html + `
                    <div class="c-etappe_playerIcon">
                    <img src="Images/teams/${globalTeamName[teller]}-2021.png" alt="citroên"/>
                </div> <p>${player}</p> </div>
                <p><b id="metric">13 km/h</b></p> 
            </div>`
                teller++;
            };
            html = html + ` 
                    </div>
                </div>
                </div>`;
        };
        return html;
    }

    // @@@@@ Dynamic extra html for etappes @@@@@

    //create default time html based on settings page
    // const defaultHTML = function (TypeDropdown, players, etappes) {
    //     TypeDropdown = "Time";
    //     players = 3;
    //     etappes = 3

    //     let html = document.querySelector(".js-etappes")
    //     html.innerHTML = extraHTML();
    // }
    // defaultHTML()
}


// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM - Main Page!")

    // Send ack to backend, backends sends response
    const youCanSend = "ack"
    socket.emit('F2B_send_player_count', youCanSend)

    socketsFuction()
    scriptFunction()
});