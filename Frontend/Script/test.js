const playerEl = document.createElement('div');
const playerInnerHTML = `
<div class="c-settings-player">
    <h2 class="c-settings-player__header">
        Player 1
    </h2>
    <div class="c-settings-player__bg">
        <div class="c-settings-player__item">
            <label class="c-settings-player__text" for="select_beacon">
                Beacon 1
            </label>
            <div class="c-settings-player__input">
                <input type="text" id="select_beacon" name="select_beacon">
            </div>
        </div>
        <div class="c-settings-player__item">
            <label class="c-settings-player__text" for="selectTeam">
                Team
            </label>
            <div class="c-settings-player__input">
                <span class="c-custom-select">
                    <select class="c-input c-custom-select__input" name="selectTeam" id="select_team" onchange="selectIcon()">
                        <option value="ag2r-citroen-team">AG2R Citroën Team</option>
                        <option value="alpecin-fenix">Alpecin - Fenix</option>
                        <option value="bahrain-victorious">Astana - Premier Tech</option>
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
            <div class="c-settings-player__input c-settings-player__icon" id="demo">
                <img class="c-settings-player__icon-img" src="Images/teams/ag2r-citroen-team-2021.png" alt="ag2r-citroen-team-2021">
            </div>
        </div>
    </div>
</div>`;

playerEl.innerHTML = playerInnerHTML;

player_container.appendChild(playerEl);