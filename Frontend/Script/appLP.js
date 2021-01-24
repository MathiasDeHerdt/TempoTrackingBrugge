const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

console.log(lanIP)

let counter = 0;
const max_etappes = 10;

let array_leaderboard = []

var global_player_name_test = ""
var global_team_name_test = ""
var global_group_name_test = ""
var global_total_time_test = ""

const max_leaderboard_players = 10


const listenToSockets = function () {
    socket.on('B2F_leaderboard_data', function (dataLeaderboard) {
        createLeaderBoard(dataLeaderboard);
    })
}

const DropdownEtappes = function () {
    //Variables
    let counter = 0
    let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")
    var list = [];

    //Dropdown up / down animation
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

    const createEtappeHTML = function (etappes) {
        const youCanSend = "ack"
        socket.emit('F2B_leaderboard_loaded', youCanSend, etappes)

        listenToSockets()
    }

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
        }
        createEtappeHTML(a0.textContent.slice(0, 1));
    }

    function SelectOption2() {
        let a2 = document.getElementById("a2");
        let a0 = document.getElementById("a0");

        if (a0 != a2) {
            let savedWord2 = a0.textContent;
            a0.innerHTML = a2.textContent;
            a2.innerHTML = savedWord2;
        }
        createEtappeHTML(a0.textContent.slice(0, 1));
    }

    //Make items in dropdown clickable and add functions to them (SelectOption1 & SelectOption2)
    //o is the element of the list
    function Clickfunction(o) {
        let option = document.getElementById(o);

        if (o == "option1") {
            option.addEventListener("click", SelectOption1)
        }

        if (o == "option2") {
            option.addEventListener("click", SelectOption2)
        }
    }

    // for each item in the list, add the Clickfunction to it.
    list.forEach(Clickfunction)
}

function selectTeam(team) {
    var team_selected = `<img class="c-img-icon__leaderboard" src="Images/teams/${team}-2021.png" alt="${team}-2021">`;
    return team_selected;
}

function removeLeaderboard() {
    while (row_container.firstChild) {
        row_container.removeChild(row_container.lastChild);
    }
}
const createLeaderBoard = function (data) {
    var positions = [document.getElementById('first'), document.getElementById('second'), document.getElementById('third')]
    const idList = ['first', 'second', 'third'];

    for (let index = 0; index < 3; index++) {
        positions[index].innerHTML = `
        <div class="c-circle" id="${idList[index]}">
        <img class="c-img__${index + 1}" src="Images/teams/${data[index].TeamName}-2021.png" alt="2021">
        <span class="c-podium__name__${index + 1}">${data[index].PlayerName}</span>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${index + 1}</span>
    </div> 
    <div class="c-circle__time__${index + 1}__fz">
      ${data[index].TotalTime} s
    </div>
    `;
    }

    let html = `<tr class="c-leaderboard-header">
    <th>Rank</th>
    <th>Name</th>
    <th>Icon</th>
    <th>Group</th>
    <th>Time</th>
  </tr>`;

    for (let index = 0; index < data.length; index++) {
        html = html + `
        <tr class="c-leaderboard-row">
        <td class="c-ranking__fw">${index + 1}</td>
        <td>${data[index].PlayerName}</td>
        <td><img class="c-img-icon__leaderboard" src="Images/teams/${data[index].TeamName}-2021.png" alt="${data[index].GroupName}-2021"></td>
        <td>${data[index].GroupName}</td>
        <td class="c-time__fw">${data[index].TotalTime} s</td>
      </tr>`
    }
    document.getElementById('row_container').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM - LeaderboardPage');
    const row_container = document.getElementById('row_container');

    const youCanSend = "ack"
    socket.emit('F2B_leaderboard_loaded', youCanSend, 3)

    listenToSockets()
    DropdownEtappes();
});