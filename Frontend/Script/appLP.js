const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

console.log(lanIP)

// listens to the backend and gets the data from the database
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

    // look what got selected in the dropdown menu (3,5 or 7)
    // send the amount back to the backend
    const createEtappeHTML = function (etappes) {

        // send message again to backend but now the etappes is a variable
        const youCanSend = "ack"
        socket.emit('F2B_leaderboard_loaded', youCanSend, etappes)

        // listen to socket to get the data from the backend
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

// dynamicly create the leaderboardpage with the data from the backend
const createLeaderBoard = function (data) {
    var positions = [document.getElementById('first'), document.getElementById('second'), document.getElementById('third')]
    const idList = ['first', 'second', 'third'];

    // fill the top 3 best players in the circles
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

    // titles above the top 10 players
    let html = `<tr class="c-leaderboard-header">
    <th>Rank</th>
    <th>Name</th>
    <th>Icon</th>
    <th>Group</th>
    <th>Time</th>
  </tr>`;

    // put the 10 fastest players on the leaderboard for fastest to slowest
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

    // send message to back that the page is loaded
    // and ready to get data
    // 3 is hardcoded because the page opens on 3 etappes
    const youCanSend = "ack"
    socket.emit('F2B_leaderboard_loaded', youCanSend, 3)

    listenToSockets()

    DropdownEtappes();
});