const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
console.log(lanIP)


// ##### Globale variabelen #####
var globalPlayerCount = 0
var globalEtappeCount = 0
var globalPlayerList = []

var globalPlayerTable = ""
var globalTotalResultTable = ""

var globalResultTable1 = ""
var globalResultTable2 = ""
var globalResultTable3 = ""
var globalResultTable4 = ""
var globalResultTable5 = ""
var globalResultTable6 = ""
var globalResultTable7 = ""

let htmlPlayer1 = "";
let htmlPlayer2 = "";
let htmlPlayer3 = "";
let htmlPlayer4 = "";
let htmlPlayer5 = "";
let htmlPlayer6 = "";
let htmlPlayer7 = "";

var allPlayerInnerHTML = ""
var globalDropDownWord = ""

let html = "";
var title = "";
var globalPlayer = "";
var globalPlayer1 = "";
var globalPlayer2 = "";
var globalPlayer3 = "";
var globalTimePlayer1 = 0;
var globalTimePlayer2 = 0;
var globalTimePlayer3 = 0;
var totalTime = 0;
var htmlTimeResult = "";
var htmlSpeedResult = "";
var playerCounter = 0;
var currentEtappe = 0;
let retryButton = "";

let counter = 0
let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")
var list = [];

var dropDownWord1 = ""
var dropDownWord2 = ""

const socketsFuction = function () {
    // Get data about the PLAYERS from the backend
    socket.on('B2F_player_settings', function (dataPlayer) {
        console.log(dataPlayer)

        // fill the global variables with data
        globalPlayerList = dataPlayer['Players'];
        console.log(globalPlayerList);

        jsonFunction(globalPlayerList);
    })

    // Get data about the GAME from the backend
    socket.on('B2F_game_settings', function (dataGame) {
        console.log(dataGame)

        // fill the global variables with data
        globalPlayerCount = dataGame.Playercount
        globalEtappeCount = dataGame.Etappecount
    })
}

const jsonFunction = function (globalPlayerList) {
    globalResultTable1 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"3"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"2"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"1"}]}';

    globalResultTable2 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"1"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"3"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"2"}]}';

    globalResultTable3 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"3"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"2"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"1"}]}';

    globalResultTable4 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"3"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"1"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"2"}]}';

    globalResultTable5 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"2"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"3"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"1"}]}';

    globalResultTable6 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"1"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"2"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"3"}]}';

    globalResultTable7 = '{"resulttbl":[' +
        '{"ResultID":"1","Date":"2021","Time":"24","PlayerID":"3"},' +
        '{"ResultID":"2","Date":"2021","Time":"29","PlayerID":"1"},' +
        '{"ResultID":"3","Date":"2021","Time":"37","PlayerID":"2"}]}';

    jsonPlayer(globalPlayerList)
}

const jsonPlayer = function (globalPlayerList) {
    globalPlayerTable = [];
    console.log(globalPlayerList);

    for (let index = 0; index < globalPlayerCount; index++) {
        let Player = globalPlayerList[index];
        console.log("Player");
        console.log(Player);
        let PlayerName = Player['PlayerName'];
        let TeamName = Player['TeamName'];

        let jsonObj = { 
            "PlayerID": `${index+1}`, 
            "PlayerName": `${PlayerName}`, 
            "TeamName": `${TeamName}`, 
            "TotalTime": 0  };

        globalPlayerTable.push(jsonObj);

        if (index == 0) {
            globalPlayer1 = PlayerName;
        }
        else if (index == 1) {
            globalPlayer2 = PlayerName;
        }
        else if (index == 2) {
            globalPlayer3 = PlayerName;
        }
    }

    console.log("globalPlayerTable");
    console.log(globalPlayerTable);
    scriptFunction()
}

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
    retryButton = document.getElementById("Retry_button");
    let endButton = document.getElementById('End_button');
    let gridButtons = document.getElementById("c-buttons_mainPage");
    let startGame = document.getElementById('startGameButton');
    let infoText = document.getElementById('infoText');

    retryButton.innerHTML = "Next etappe"

    // Queryselectors
    const a1 = document.querySelector("#a1");
    const a2 = document.querySelector("#a2");

    // Eventlisteners
    a1.addEventListener("click", SelectOption1);
    a2.addEventListener("click", SelectOption2);
    playButton.addEventListener("click", start);
    pauseButton.addEventListener("click", pause);
    endButton.addEventListener('click', reset)
    retryButton.addEventListener("click", Retry);

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

        showEtappes()
    }
    wrapperdropdown.addEventListener("click", Dropdown)


    // ##### Timer #####
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

        setTimeout(start, 3000) // Now 2sec for testing
    }

    // Start the timer
    function start() {
        showEtappes()

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

        
        if (currentEtappe < parseInt(globalEtappeCount) - 1) {
            retryButton.innerHTML = "Next etappe";
            currentEtappe += 1;
        }
        else if (currentEtappe == parseInt(globalEtappeCount) - 1) {
            retryButton.innerHTML = "Retry";
            currentEtappe += 1;
        }
        else if (currentEtappe == parseInt(globalEtappeCount)) {
            retryButton.innerHTML = "Next etappe";
            currentEtappe = 0;
        }
        
        
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

    // ##### The buttons #####
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

    // ##### Show the etappes #####
    const showEtappes = function () {
        console.log("showEtappes");
        let html = document.querySelector(".js-etappes");

        html.innerHTML = "";
        console.log(globalDropDownWord);

        if (globalDropDownWord == "" || globalDropDownWord == "Time" || globalDropDownWord == "Speed") {
            console.log(`globalEtappeCount = ${globalEtappeCount}`);
            for (let index = 0; index < globalEtappeCount; index++) {
                html.innerHTML += extraHTML(index + 1);
                getResultV2(index + 1)
            }
        }
        else if (globalDropDownWord == "Results") {
            html.innerHTML = "";
            while (playerCounter == 0) {
                for (let index = 0; index < globalEtappeCount; index++) {
                    getTotalTime(index+1); 
                }
            }
            for (let index = 0; index < 2; index++) {
                if (index == 0) {
                    title = "Time"
                    html.innerHTML += extraResultHTML(index + 1, title);
                }
                else if (index == 1) {
                    title = "Speed"
                    html.innerHTML += extraResultHTML(index + 1, title);
                }
            }
            getResultV3()
        }
    }

    document.getElementById('startGameButton').onclick = function () {
        // elementen tonen en verbergen
        startGame.classList.add("o-hide")
        infoText.classList.add("o-hide")

        countdown()
    };

    // ##### Get results out of json #####
    const getResultV2 = function (etappe) {
        var result;

        console.log("getResultV2");

        htmlPlayer1 = document.querySelector(".js-player1");
        htmlPlayer2 = document.querySelector(".js-player2");
        htmlPlayer3 = document.querySelector(".js-player3");
        htmlPlayer4 = document.querySelector(".js-player4");
        htmlPlayer5 = document.querySelector(".js-player5");
        htmlPlayer6 = document.querySelector(".js-player6");
        htmlPlayer7 = document.querySelector(".js-player7");


        if (etappe == 1) {
            result = globalResultTable1;
            htmlPlayer1.innerHTML = "";
        }
        else if (etappe == 2) {
            result = globalResultTable2;
            htmlPlayer2.innerHTML = "";
        }
        else if (etappe == 3) {
            result = globalResultTable3;
            htmlPlayer3.innerHTML = "";
        }
        else if (etappe == 4) {
            result = globalResultTable4;
            htmlPlayer4.innerHTML = "";
        }
        else if (etappe == 5) {
            result = globalResultTable5;
            htmlPlayer5.innerHTML = "";
        }
        else if (etappe == 6) {
            result = globalResultTable6;
            htmlPlayer6.innerHTML = "";
        }
        else if (etappe == 7) {
            result = globalResultTable7;
            htmlPlayer7.innerHTML = "";
        }

        var objectResult = JSON.parse(result);

        const a1 = globalPlayerTable
        const a2 = objectResult.resulttbl;

        const merge = (arr1, arr2) => {
            const temp = []

            arr1.forEach(x => {
                arr2.forEach(y => {
                    if (x.PlayerID === y.PlayerID) {
                        temp.push({ ...x, ...y })
                    }
                })
            })

            return temp
        }
        var mergedJSON = merge(a2, a1)

        console.log(mergedJSON);
        for (let index = 0; index < globalPlayerCount; index++) {
            var naam = mergedJSON[index].PlayerName
            var tijd = mergedJSON[index].Time;
            var team = mergedJSON[index].TeamName;

            if (globalDropDownWord == "" | globalDropDownWord == "Time") {
                if (etappe == 1 && currentEtappe >= 1) {
                    htmlPlayer1.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 2 && currentEtappe >= 2) {
                    htmlPlayer2.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 3 && currentEtappe >= 3) {
                    htmlPlayer3.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 4 && currentEtappe >= 4) {
                    htmlPlayer4.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 5 && currentEtappe >= 5) {
                    htmlPlayer5.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 6 && currentEtappe >= 6) {
                    htmlPlayer6.innerHTML += createTimeHTML(naam, tijd, team)
                }

                if (etappe == 7 && currentEtappe >= 7) {
                    htmlPlayer7.innerHTML += createTimeHTML(naam, tijd, team)
                }
            }
            else if (globalDropDownWord == "Speed") {
                if (etappe == 1 && currentEtappe >= 1) {
                    htmlPlayer1.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 2 && currentEtappe >= 2) {
                    htmlPlayer2.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 3 && currentEtappe >= 3) {
                    htmlPlayer3.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 4 && currentEtappe >= 4) {
                    htmlPlayer4.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 5 && currentEtappe >= 5) {
                    htmlPlayer5.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 6 && currentEtappe >= 6) {
                    htmlPlayer6.innerHTML += createSpeedHTML(naam, tijd, team)
                }

                if (etappe == 7 && currentEtappe >= 7) {
                    htmlPlayer7.innerHTML += createSpeedHTML(naam, tijd, team)
                }
            }
        }
    }

    const getResultV3 = function () {
        console.log("getResultV3");

        htmlTimeResult = document.querySelector(".js-player1");
        htmlSpeedResult = document.querySelector(".js-player2");

        htmlTimeResult.innerHTML= "";
        htmlSpeedResult.innerHTML = "";

        const a1 = globalPlayerTable;

        for (let index = 0; index < globalPlayerCount; index++) {
            if (globalPlayer1 == a1[index].PlayerName) {
                a1[index].TotalTime = globalTimePlayer1
            }
            else if (globalPlayer2 == a1[index].PlayerName) {
                a1[index].TotalTime = globalTimePlayer2
            }
            else if (globalPlayer3 == a1[index].PlayerName) {
                a1[index].TotalTime = globalTimePlayer3
            }
        }

        a1.sort(function(a, b) {
            return a.TotalTime - b.TotalTime;
        });


        for (let index = 0; index < 2; index++) {
            if (index == 0) {
                for (let index = 0; index < globalPlayerCount; index++) {
                    var naam = a1[index].PlayerName
                    var totale_tijd = a1[index].TotalTime;
                    var team = a1[index].TeamName;

                    htmlTimeResult.innerHTML += createTimeResultHTML(naam, totale_tijd, team);
                }
            }
            else if (index == 1) {
                for (let index = 0; index < globalPlayerCount; index++) {
                    var naam = a1[index].PlayerName
                    var totale_tijd = a1[index].TotalTime;
                    var team = a1[index].TeamName;
        
                    htmlSpeedResult.innerHTML += createSpeedResultHTML(naam, totale_tijd, team);
                }
            }
        }

    }

    const getTotalTime = function (etappe) {
        var result;

        if (etappe == 1) {
            result = globalResultTable1;
        }
        else if (etappe == 2) {
            result = globalResultTable2;
        }
        else if (etappe == 3) {
            result = globalResultTable3;
        }
        else if (etappe == 4) {
            result = globalResultTable4;
        }
        else if (etappe == 5) {
            result = globalResultTable5;
        }
        else if (etappe == 6) {
            result = globalResultTable6;
        }
        else if (etappe == 7) {
            result = globalResultTable7;
        }

        const a1 = globalPlayerTable;
        const a2 = JSON.parse(result).resulttbl;

        const merge = (arr1, arr2) => {
            const temp = []

            arr1.forEach(x => {
                arr2.forEach(y => {
                    if (x.PlayerID === y.PlayerID) {
                        temp.push({ ...x, ...y })
                    }
                })
            })

            return temp
        }
        var mergedJSON = merge(a2, a1)
        // console.log(mergedJSON)

        for (let index = 0; index < globalPlayerCount; index++) {
            var tijd = mergedJSON[index].Time;
            var naam = mergedJSON[index].PlayerName

            if (globalPlayer1 == naam) {
                globalTimePlayer1 += parseInt(tijd);
            }
            else if (globalPlayer2 == naam) {
                globalTimePlayer2 += parseInt(tijd);
            }
            else if (globalPlayer3 == naam) {
                globalTimePlayer3 += parseInt(tijd);
            }
        }
        playerCounter += 1;
    }

    // ##### GENERATING HTML DYNAMICLY #####
    const extraHTML = function (number) {
        const etappeEl = document.createElement('div');
        var etappeInnerHTML = "";

        etappeEl.classList.add('c-etappe');
        etappeInnerHTML = `
        <div class="c-etappe__${number}">
          <div class="c-etappe__card">
            <div class="c-etappe__title">
                <p class="c-E1">Etappe ${number}</p>
            </div>
            <div class="c-etappe__playersTotal js-player${number}">

            </div>
          </div>
        </div>
        `;
        return etappeInnerHTML
    }

    const extraResultHTML = function (number, title) {
        const etappeEl = document.createElement('div');
        var etappeInnerHTML = "";

        etappeEl.classList.add('c-etappe');
        etappeInnerHTML = `
        <div class="c-etappe__${number}">
          <div class="c-etappe__card">
            <div class="c-etappe__title">
                <p class="c-E1">${title}</p>
            </div>
            <div class="c-etappe__playersTotal js-player${number}">

            </div>
          </div>
        </div>
      </div>
        `;
        return etappeInnerHTML
    }

    const createTimeHTML = function (name, time, team) {
        var playerInnerHTML = `
        <div class="c-etappe_player">
            <div class="c-etappe_player__nameIcon">
                <div class="c-etappe_playerIcon">
                <img class="c-img-icon" src="Images/teams/${team}-2021.png" alt="${team}-2021">
                </div> 
                <p>${name}</p> 
            </div>
            <p><b>${time} sec</b></p> 
        </div>
        `;
        return playerInnerHTML
    };

    const createTimeResultHTML = function (name, time, team) {
        var timeMinSec = Math.round(time/60) + ":" + time%60;
        var playerInnerHTML = `
        <div class="c-etappe_player">
            <div class="c-etappe_player__nameIcon">
                <div class="c-etappe_playerIcon">
                <img class="c-img-icon" src="Images/teams/${team}-2021.png" alt="${team}-2021">
                </div> 
                <p>${name}</p> 
            </div>
            <p><b>${timeMinSec} min</b></p> 
        </div>
        `;
        return playerInnerHTML
    };

    const createSpeedHTML = function (name, time, team) {
        var playerInnerHTML = `
        <div class="c-etappe_player">
            <div class="c-etappe_player__nameIcon">
                <div class="c-etappe_playerIcon">
                    <img class="c-img-icon" src="Images/teams/${team}-2021.png" alt="${team}-2021">
                </div> 
                <p>${name}</p> 
            </div>
            <p><b>${Math.round((333 / time) * 3.6)} km/h</b></p> 
        </div>
        `;
        return playerInnerHTML
    };

    const createSpeedResultHTML = function (name, time, team) {
        var playerInnerHTML = `
        <div class="c-etappe_player">
            <div class="c-etappe_player__nameIcon">
                <div class="c-etappe_playerIcon">
                    <img class="c-img-icon" src="Images/teams/${team}-2021.png" alt="${team}-2021">
                </div> 
                <p>${name}</p> 
            </div>
            <p><b>${Math.round(((333*globalEtappeCount) / time) * 3.6)} km/h</b></p> 
        </div>
        `;
        return playerInnerHTML
    };

    // ##### CLICK FUCTIONS FOR THE DROPDOWN #####
    function Clickfunction(o) {
        let option = document.getElementById(o);

        if (o == "option1") {
            // option.addEventListener("click", SelectOption1)
        }

        if (o == "option2") {
            //option.addEventListener("click", SelectOption2)
        }
    }

    // for each item in the list, add the Clickfunction to it.
    list.forEach(Clickfunction)
    //Make list with li items to make them clickable with ClickFunction
    const listItems = document.querySelectorAll('.c-dropdown li');

    for (let i = 0; i <= listItems.length - 1; i++) {
        list.push(listItems[i].id);
    }

    //Functions connected to a click event
    function SelectOption1() {
        let a1 = document.getElementById("a1");
        let a0 = document.getElementById("a0");
    
        if (a0 != a1) {
          let savedWord1 = a0.textContent;
          a0.innerHTML = a1.textContent;
          a1.innerHTML = savedWord1;

          globalDropDownWord = a0.textContent;
        }
      }
    
    function SelectOption2() {
      let a2 = document.getElementById("a2");
      let a0 = document.getElementById("a0");

      if (a0 != a2) {
        let savedWord2 = a0.textContent;
        a0.innerHTML = a2.textContent;
        a2.innerHTML = savedWord2;

        globalDropDownWord = a0.textContent;
      }
    }
}

// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM - Main Page!")

    // Send ack to backend, backends sends response
    const youCanSend = "ack"
    socket.emit('F2B_send_player_count', youCanSend)

    socketsFuction()
});