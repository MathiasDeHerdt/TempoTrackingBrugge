// start MainPage js
// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded")

    // #region ===== Sidebar  //

    // width moet nog aangepast worden naar transform.
    document.getElementById("js-button-open").addEventListener("click",function(){
    document.getElementById("myNav").style.transform= "translateX(0)";
    });

    document.getElementById("js-option-close").addEventListener("click",function(){
    document.getElementById("myNav").style.transform= "translateX(-100%)";


    // Settingspage
    const player_container = document.getElementById('player_container');
    getPlayers();
    });
    // #endregion
    

    // #region ===== timer  //

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
  
  // Create function to modify innerHTML
  
  function print(txt) {
    document.getElementById("display").innerHTML = txt;
  }
  
  // Create "start", "pause" and "reset" functions
  
  function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, 10);
    showButton("PAUSE");
  }
  
  function pause() {
    clearInterval(timerInterval);
    showButton("PLAY");
  }
  
  function reset() {
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
    showButton("PLAY");
  }
  
  // Create function to display buttons
  
  function showButton(buttonKey) {
    const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
    const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
    buttonToShow.style.display = "block";
    buttonToHide.style.display = "none";
  }
  // Create event listeners
  
  let playButton = document.getElementById("playButton");
  let pauseButton = document.getElementById("pauseButton");
  
  playButton.addEventListener("click", start);
  pauseButton.addEventListener("click", pause);

});
// ========================
// End MainPage js
// =======================


// ======================
// Start SettingsPage JS
// ======================

var total_number = 1; 

function selectIcon() {
  for (let i = 1; i <= total_number; i++) {
    const team = "select_team_" + i;
    const icon = "select_icon_" + i;
    var x = document.getElementById(team).value;
    var icon_selected = `<img class="c-settings-player__icon-img" src="Images/teams/${x}-2021.png" alt="${x}-2021">`
    document.getElementById(icon).innerHTML = icon_selected;
  }
}

function selectPlayers() {
  var x = document.getElementById("select_players").value;
  total_number = x;
  removePlayers();
  getPlayers();
}

function removePlayers() {
	while (player_container.firstChild) {
		player_container.removeChild(player_container.lastChild);
	}
}

const getPlayers = async () => {
    for (let i = 1; i <= total_number; i++) {
        await createNewPlayer(i);
	}
}

function createNewPlayer(number) {
  const playerEl = document.createElement('div');
  playerEl.classList.add('pokemon');


  const playerInnerHTML = `
  <div class="c-settings-player">
    <h2 class="c-settings-player__header c-settings-setup__item-invis">
        Player ${number}
    </h2>
    <div class="c-settings-player__bg">
        <div class="c-settings-player__item">
            <label class="c-settings-player__text" for="select_beacon_${number}">
                Beacon ${number}
            </label>
            <div class="c-settings-player__input">
                <input class="c-custom-select__text" type="text" id="select_beacon_${number}" name="select_beacon_${number}" placeholder="PLAYER NAME" onchange="validateSettings();">
            </div>
        </div>
        <div class="c-settings-player__item">
            <label class="c-settings-player__text" for="select_team_${number}">
                Team
            </label>
            <div class="c-settings-player__input">
                <span class="c-custom-select">
                    <select class="c-input c-custom-select__dropdown" name="select_team_${number}" id="select_team_${number}" onchange="selectIcon(); validateSettings();">
                        <option value="ag2r-citroen-team">AG2R Citroën Team</option>
                        <option value="alpecin-fenix">Alpecin - Fenix</option>
                        <option value="astana-premier-tech">Astana - Premier Tech</option>
                        <option value="bahrain-victorious">Bahrain - Victorious</option>
                        <option value="bora-hansgrohe">BORA - hansgrohe</option>
                        <option value="cofidis-solutions-credits">Cofidis</option>
                        <option value="deceuninck-quick-step">Deceuninck - Quick-Step</option>
                        <option value="audi">EF Education - Nippo</option>
                        <option value="groupama-fdj">Groupama - FDJ</option>
                        <option value="ineos-grenadiers">INEOS Grenadiers</option>
                        <option value="audi">Intermarché Wanty Gobert</option>
                        <option value="israel-start-up-nation">Israel Start-Up Nation</option>
                        <option value="lotto-soudal">Lotto Soudal</option>
                        <option value="movistar-team">Movistar Team</option>
                        <option value="team-bikeexchange">Team BikeExchange</option>
                        <option value="team-dsm">Team DSM</option>
                        <option value="team-jumbo-visma">Team Jumbo-Visma</option>
                        <option value="audi">Team Qhubeka ASSOS</option>
                        <option value="audi">Trek - Segafredo</option>
                        <option value="uae-team-emirates">UAE-Team Emirates</option>
                    </select>
                </span>
            </div>
        </div>
        <div class="c-settings-player__item">
            <p class="c-settings-player__text">
                Icon
            </p>
            <div class="c-settings-player__input c-settings-player__icon" id="select_icon_${number}">
                <img class="c-settings-player__icon-img" src="Images/teams/ag2r-citroen-team-2021.png" alt="ag2r-citroen-team-2021">
            </div>
        </div>
    </div>
  </div>
  `;

  playerEl.innerHTML = playerInnerHTML;

	player_container.appendChild(playerEl);
};

function validateSettings() {
    var validate_game_settings = false;
    
    console.log("----- GAME SETTINGS ------");
    
    const select_players = document.getElementById('select_players').value;
    const select_group = document.getElementById('select_group').value;
    const select_etappes = document.getElementById('select_etappes').value;
    
    console.log("Player count: " + select_players);
    console.log("Game group: " + select_group);
    console.log("Etappe count: " + select_etappes);

    printerFunction(select_etappes)
    
    if ( select_players && select_group && select_etappes) {
        validate_game_settings = true;
    }
    else {
        validate_game_settings = false;
    }

    console.log("----- PLAYER SETTINGS ------");
    
    for (let i = 1; i <= total_number; i++) {
        const name = "select_beacon_" + i;
        const team = "select_team_" + i;
        
        if (document.getElementById(name) != null) {
            const select_name = document.getElementById(name).value;
            const select_team = document.getElementById(team).value;
            console.log("Player " + i + " name: " + select_name);
            console.log("Player " + i + " team: " + select_team);

            if ( select_name && select_team) {
                validate_game_settings = true;
            }
            else {
                validate_game_settings = false;
            }
        }     
    }
    
    console.log("----- CONTROLE -----");

    const save_settings = document.getElementById('save_settings');
    
    if (validate_game_settings) {
        save_settings.disabled = false;
    }
    else {
        save_settings.disabled = true;
    }
}

function enableButton() {
    const go_to_game = document.getElementById('go_to_game');
    go_to_game.disabled = false;
}

