const lanIP = `${window.location.hostname}:5000`;
//const socket = io(`http://${lanIP}`);

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
        //socket.emit('F2B_start_timer', startTimer)

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

    // ################################
    // Code dropdown en andere html dingen (van Thibeau)
    // ################################

    //Variables
    let counter = 0
    let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")
    var list = [];

    //Dropdown up / down animation
    function Dropdown(){
        counter += 1;
  
        if (counter == 1){
          wrapperdropdown.classList.add("active");
          let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
          arrow.style.transform = "rotate(180deg)"
        }
  
        if (counter == 2){
          wrapperdropdown.classList.remove("active");
          let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
          arrow.style.transform = "rotate(0deg)"
          counter = 0;
        }
      }
      wrapperdropdown.addEventListener("click",Dropdown)

    //Update item in dropdown once item is clicked and generate specific html
    const createEtappeHTML = function(nameDropdownItem, numberPlayers, numberEtappes){
        if(nameDropdownItem == "Speed"){
          if(numberPlayers == 1 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
        }
        if(nameDropdownItem == "Time"){
          if(numberPlayers == 1 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 1</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 2</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 3</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 4</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 5</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 6</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Etappe 7</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
        }
        if(nameDropdownItem == "Results"){
          if(numberPlayers == 1 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 3){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
            
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 5){
            const htmlObj = `
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__3">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
  
          if(numberPlayers == 1 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__1">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>
            `;
            return htmlObj;
          }
    
          if(numberPlayers == 2 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Time</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 s</b></p> 
                  </div>
                </div>
              </div>
            </div>
    
            <div class="c-etappe__2">
              <div class="c-etappe__card">
                <div class="c-etappe__title">
                    <p class="c-E1">Speed</p>
                </div>
                <div class="c-etappe__playersTotal">
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                  <div class="c-etappe_player">
                    <div class="c-etappe_player__nameIcon">
                        <div class="c-etappe_playerIcon">
                            <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                        </div> 
                        <p>Thibeau</p> 
                    </div>
                    <p><b>13 km/h</b></p> 
                  </div>
                </div>
              </div>
            </div>`;
            return htmlObj;
          }
    
          if(numberPlayers == 3 & numberEtappes == 7){
            const htmlObj = `
            <div class="c-etappe__3">
            <div class="c-etappe__card">
              <div class="c-etappe__title">
                  <p class="c-E1">Time</p>
              </div>
              <div class="c-etappe__playersTotal">
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 s</b></p> 
                </div>
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 s</b></p> 
                </div>
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 s</b></p> 
                </div>
              </div>
            </div>
          </div>
          <div class="c-etappe__3">
            <div class="c-etappe__card">
              <div class="c-etappe__title">
                  <p class="c-E1">Speed</p>
              </div>
              <div class="c-etappe__playersTotal">
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 km/h</b></p> 
                </div>
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 km/h</b></p> 
                </div>
                <div class="c-etappe_player">
                  <div class="c-etappe_player__nameIcon">
                      <div class="c-etappe_playerIcon">
                          <img src="Images/teams/ag2r-citroen-team-2021.png" alt="citroên"/>
                      </div> 
                      <p>Thibeau</p> 
                  </div>
                  <p><b>13 km/h</b></p> 
                </div>
              </div>
            </div>
          </div>`;
            return htmlObj;
          }
        }
    };
  

    //Make list with li items to make them clickable with ClickFunction
    const listItems = document.querySelectorAll('.c-dropdown li');
    for (let i = 0; i <= listItems.length - 1; i++) {
        list.push(listItems[i].id);
    }

    //Functions connected to a click event
    function SelectOption1(){
        let a1 = document.getElementById("a1");
        let a0 = document.getElementById("a0");
        
        if(a0 != a1){
          let savedWord1 = a0.textContent;
          a0.innerHTML = a1.textContent;
          a1.innerHTML = savedWord1;
        }
  
        let html = document.querySelector(".js-etappes")
        html.innerHTML = createEtappeHTML(a0.textContent,3,3);   
    }
  
    function SelectOption2(){
        let a2 = document.getElementById("a2");
        let a0 = document.getElementById("a0");
        
        if(a0 != a2){
          let savedWord2 = a0.textContent;
          a0.innerHTML = a2.textContent;
          a2.innerHTML = savedWord2;
        }
  
        let html = document.querySelector(".js-etappes")
        html.innerHTML = createEtappeHTML(a0.textContent,1,3);
      }
  
    //Make items in dropdown clickable and add functions to them (SelectOption1 & SelectOption2)
    //o is the element of the list
    function Clickfunction(o){
        let option = document.getElementById(o);
  
        if(o == "option1"){
          option.addEventListener("click", SelectOption1)
        }
  
        if(o == "option2"){
          option.addEventListener("click", SelectOption2)
        }
    }

    // for each item in the list, add the Clickfunction to it.
    list.forEach(Clickfunction)
  
  
  
    //create default time html based on settings page
    const defaultHTML = function(TypeDropdown, players, etappes){
        TypeDropdown = "Time";
        players = 3;
        etappes = 3
  
        let html = document.querySelector(".js-etappes")
        html.innerHTML = createEtappeHTML(TypeDropdown,players,etappes);
        
    }
    // ################################
    // Code code dropdown en andere html dingen (van Thibeau)
    // ################################

};

// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM - Main Page")
    

    script()
});
