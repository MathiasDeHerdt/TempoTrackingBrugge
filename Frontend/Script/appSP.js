
//#region === Variables =====================================================================================================
const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
console.log(lanIP)


// Html elements
let html_listPlayerContainer;
let html_countPlayer, html_selectedGroup, html_countEtappe, html_countDistance;
let btnSaveSettings, btnToGame;

// Settings
let totalPlayerCount = 1;

let global_countPlayers = totalPlayerCount;
let global_countEtappes = 0;
let global_groupName = "";
let global_distance = 0;

// Players
let global_playerList = [];

// Beacons
let global_listBeacons = []

//#endregion


//#region === HTML Functions =====================================================================================================
const selectIcon = function() {
    //Select icon corresponding to team
    for (let i = 1; i <= totalPlayerCount; i++) {
        const team = "select_team_" + i;
        const icon = "select_icon_" + i;
        var teamName = document.getElementById(team).value;
        var selectedIcon = `<img class="c-settings-player__icon-imgSP" src="./Images/teams/${teamName}-2021.png" alt="${teamName}-2021">`
        document.getElementById(icon).innerHTML = selectedIcon;
    }
};

const clearPlayerList = function() {
    //Clear player tabs
    while (html_listPlayerContainer.firstChild) {
        html_listPlayerContainer.removeChild(html_listPlayerContainer.lastChild);
    }
};

const createPlayerList = async function () {
    //As long as no beacons are available, no player list
    if(global_listBeacons.length <= 0)
        return;

    //Fill list with player tabs
    for (let i = 1; i <= totalPlayerCount; i++) {
        playerTab = await createPlayerTab(i);
        html_listPlayerContainer.appendChild(playerTab);
    }
};

const createPlayerTab = function (number) {
    //Retrieve dropdowns + create object
    const playerTab = document.createElement('div');
    const html_teamDropdown = createTeamDropdown(number);
    const html_beaconDropdown = createBeaconDropdown(number);

    //Create one player tab
    const playerInnerHTML = `
    <div class="c-settings-player">
        <h2 class="c-settings-player__header c-settings-setup__item-invis">
            Player ${number}
        </h2>
        <div class="c-settings-player__bg">
            <div class="c-settings-player__item">
                <label class="c-settings-player__text" for="select_player_${number}">
                    Name
                </label>
                <div class="c-settings-player__input">
                    <input class="c-custom-select__text" type="text" id="select_player_${number}" name="select_player_${number}" placeholder="PLAYER NAME" onchange="validateSettings();">
                </div>
            </div>

            <!-- Beacon Heb ik toegevoegd en heb de onchange weggedaan, omdat deze info nog nergens wordt verwerkt -->
            <div class="c-settings-player__item">
                <label class="c-settings-player__text" for="select_team_${number}">
                    Beacon
                </label>
            <div class="c-settings-player__input">
                <span class="c-custom-select">
                    ${html_beaconDropdown}
                </span>
            </div>
        </div>
        <div class="c-settings-player__item">
            <label class="c-settings-player__text" for="select_team_${number}">
                Team
            </label>
            <div class="c-settings-player__input">
                <span class="c-custom-select">
                    ${html_teamDropdown}
                </span>
            </div>
        </div>
        <div class="c-settings-player__item">
            <p class="c-settings-player__text">
                Icon
            </p>
            <div class="c-settings-player__input c-settings-player__icon" id="select_icon_${number}">
                <img class="c-settings-player__icon-imgSP" src="Images/teams/ag2r-citroen-team-2021.png" alt="ag2r-citroen-team-2021">
            </div>
        </div>
    </div>
    `;

    //Return tab
    playerTab.innerHTML = playerInnerHTML;
    return playerTab;
};

const createBeaconDropdown = function(number) {
    //Create dropdown for beacons
    let html_dropdown = `<select class="c-input c-custom-select__dropdown" name="select_beacon_${number}" id="select_beacon_${number}";">`;
    for(const beacon of global_listBeacons){
        html_dropdown += createBeaconDropdownItem(beacon);
    }
    html_dropdown += `</select>`;
    return html_dropdown;
};

const createBeaconDropdownItem = function(beacon){
    const UUID = beacon['UUID'];
    const showName = `${UUID.substring(0, 8)}...`;
    const htmlItem = `<option value="${UUID}">${showName}</option>`;
    return htmlItem;
};

const createTeamDropdown = function(number) {
    //Create dropdown for teams
    const html_dropdown = `
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
    </select>`;
    return html_dropdown;
};
//#endregion


//#region === Validation Functions =====================================================================================================
const validateSettings = function() {
    let isGameValid = validateSettingsGame();
    let isPlayersValid = validateSettingsPlayers();

    console.log("----- CONTROLE -----");

    if (isGameValid == true && isPlayersValid == true) {
        save_settings.disabled = false;
        console.log("Settings are valid")
    }
    else {
        save_settings.disabled = true;
        console.log("Settings are NOT valid!!")
    }
};

const validateSettingsGame = function(){
    //Check game settings
    console.log("----- GAME SETTINGS ------");
    isValid = false;

    global_countPlayers = parseInt(html_countPlayer.value);
    global_groupName    = html_selectedGroup.value;
    global_countEtappes = parseInt(html_countEtappe.value);
    global_distance     = parseFloat(html_countDistance.value);

    console.log("Player count: " + global_countPlayers);
    console.log("Game group: " + global_groupName);
    console.log("Etappe count: " + global_countEtappes);
    console.log("Distance: " + global_distance);

    if (global_countPlayers > 0 && global_countEtappes > 0 && global_distance > 0 &&
        checkInput(global_groupName) == true) {
        isValid = true;
    }
    return isValid;
};

const validateSettingsPlayers = function(){
    //Check player settings
    console.log("----- PLAYER SETTINGS ------");
    isValid = true;

    //Wipe old list
    global_playerList = [];

    //Check each player tab
    if(totalPlayerCount <= 0)
        return false;

    for (let i = 1; i <= totalPlayerCount; i++) {
        const name = "select_beacon_" + i;
        const team = "select_team_" + i;
        const player = "select_player_" + i;

        if (document.getElementById(name) != null) {
            const playerName = document.getElementById(player).value;
            const teamName = document.getElementById(team).value;
            const beaconName = document.getElementById(name).value

            console.log(`
            Player ${i} - name: ${playerName} \n 
            Player ${i} - team: ${teamName} \n
            Player ${i} - beacon: ${beaconName}`);

            //If all is filled in, add to player list
            if (checkInput(playerName) == true && 
                checkInput(teamName) == true && 
                checkInput(beaconName) == true) {
                addPlayerToList(playerName, teamName, beaconName)
            }
            else{
                isValid = false;
            }
        }
    }

    return isValid;
};

const checkInput = function(input){
    console.log(`Checking input - ${input}`);
    if(input != null && input.length > 0)
        return true;

    console.log(`Checking input FALSE - ${input}`);
    return false;
};

const addPlayerToList = function(playerName, teamName, beaconName){
    jsonObj = {
        'PlayerName' : playerName,
        'TeamName' : teamName,
        'UUID' : beaconName
    };
    global_playerList.push(jsonObj)
};
//#endregion


//#region === Event functions =====================================================================================================
const clickSaveSettings = function() {
    btnToGame.disabled = false;
    btnSaveSettings.disabled = true;
    saveSettings();
};

const clickToGame = function() {
    console.log('Going to MainPage.html...');
    //startGame(); //temp
    document.location.href = "./MainPage.html"
};

const chancePlayerCount = function() {
    //Get number of players
    totalPlayerCount = html_countPlayer.value;

    //Create list of player tabs
    clearPlayerList();
    createPlayerList();
};
//#endregion


//#region === Socket - Responses =====================================================================================================
const listenToSocket = function () {
    console.log("listenToSocket");
    socket.on('B2F_beacons_found', setBeaconList);
};

const setBeaconList = function(jsonObj){
    global_listBeacons = jsonObj['beacons'];
    console.log(`B2F_beacons_found`);
    //console.log(global_listBeacons)
    createPlayerList();
};
//#endregion


//#region === Socket - Requests =====================================================================================================
const pageLoaded = function () {
    console.log(`F2B_beacons_request`);
    socket.emit('F2B_beacons_request');
};

const saveSettings = function () {
    console.log(`F2B_game_settings`);
    jsonGameSettings = {
        'PlayerCount' : global_countPlayers,
        'EtappeCount' : global_countEtappes,
        'GroupName' : global_groupName,
        'FinishWidth' : global_distance
    }
    socket.emit('F2B_game_settings', jsonGameSettings);

    console.log(`F2B_player_settings`);
    jsonPlayerSettings = {
        'Players' : global_playerList
    }
    socket.emit('F2B_player_settings', jsonPlayerSettings);
};

const startGame = function () {
    console.log(`F2B_start_timer`);
    socket.emit('F2B_start_timer', "start!");
};
//#endregion


//#region === DOM Content =====================================================================================================
const getElements = function(){
    html_listPlayerContainer = document.getElementById('player_container');
    html_countPlayer = document.getElementById("select_players");
    html_selectedGroup = document.getElementById('select_group');
    html_countEtappe = document.getElementById('select_etappes');
    html_countDistance = document.getElementById('select_finish');

    btnSaveSettings = document.getElementById('save_settings');
    btnToGame = document.getElementById('go_to_game');
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM - Settings Page');
    pageLoaded();

    //Get HTML elements
    getElements();

    //Socket IO
    listenToSocket();

    //Other
    validateSettings();
});
//#endregion
  
