<<<<<<< HEAD
const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

console.log(lanIP)
=======
// ---------- TESTDATA ----------
>>>>>>> CssV1

let counter = 0;
const max_etappes = 10;

<<<<<<< HEAD
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
=======

const resulttbl3 = '{"resulttbl":[' +
  '{"ResultID":"0","Date":"","":"","PlayerID":"0"},' +
  '{"ResultID":"1","Date":"2021","Time":"324","PlayerID":"2"},' +
  '{"ResultID":"2","Date":"2021","Time":"329","PlayerID":"4"},' +
  '{"ResultID":"3","Date":"2021","Time":"338","PlayerID":"6"},' +
  '{"ResultID":"4","Date":"2021","Time":"342","PlayerID":"8"},' +
  '{"ResultID":"5","Date":"2021","Time":"345","PlayerID":"10"},' +
  '{"ResultID":"6","Date":"2021","Time":"349","PlayerID":"9"},' +
  '{"ResultID":"7","Date":"2021","Time":"355","PlayerID":"7"},' +
  '{"ResultID":"8","Date":"2021","Time":"356","PlayerID":"5"},' +
  '{"ResultID":"9","Date":"2021","Time":"364","PlayerID":"3"},' +
  '{"ResultID":"10","Date":"2021","Time":"387","PlayerID":"1"}]}';

const resulttbl5 = '{"resulttbl":[' +
  '{"ResultID":"0","Date":"","":"","PlayerID":"0"},' +
  '{"ResultID":"1","Date":"2021","Time":"524","PlayerID":"4"},' +
  '{"ResultID":"2","Date":"2021","Time":"529","PlayerID":"3"},' +
  '{"ResultID":"3","Date":"2021","Time":"538","PlayerID":"6"},' +
  '{"ResultID":"4","Date":"2021","Time":"542","PlayerID":"7"},' +
  '{"ResultID":"5","Date":"2021","Time":"545","PlayerID":"5"},' +
  '{"ResultID":"6","Date":"2021","Time":"549","PlayerID":"1"},' +
  '{"ResultID":"7","Date":"2021","Time":"555","PlayerID":"10"},' +
  '{"ResultID":"8","Date":"2021","Time":"556","PlayerID":"9"},' +
  '{"ResultID":"9","Date":"2021","Time":"564","PlayerID":"8"},' +
  '{"ResultID":"10","Date":"2021","Time":"587","PlayerID":"2"}]}';

const resulttbl7 = '{"resulttbl":[' +
  '{"ResultID":"0","Date":"","":"","PlayerID":"0"},' +
  '{"ResultID":"1","Date":"2021","Time":"724","PlayerID":"10"},' +
  '{"ResultID":"2","Date":"2021","Time":"729","PlayerID":"9"},' +
  '{"ResultID":"3","Date":"2021","Time":"738","PlayerID":"8"},' +
  '{"ResultID":"4","Date":"2021","Time":"742","PlayerID":"7"},' +
  '{"ResultID":"5","Date":"2021","Time":"745","PlayerID":"6"},' +
  '{"ResultID":"6","Date":"2021","Time":"749","PlayerID":"5"},' +
  '{"ResultID":"7","Date":"2021","Time":"755","PlayerID":"4"},' +
  '{"ResultID":"8","Date":"2021","Time":"756","PlayerID":"3"},' +
  '{"ResultID":"9","Date":"2021","Time":"764","PlayerID":"2"},' +
  '{"ResultID":"10","Date":"2021","Time":"787","PlayerID":"1"}]}';

const playertbl = '{"playertbl":[' +
  '{"PlayerID":"0","PlayerName":"","GroupName":"","BeaconID":"0","Team":""},' +
  '{"PlayerID":"1","PlayerName":"Bent","GroupName":"MCT","BeaconID":"1","Team":"ag2r-citroen-team"},' +
  '{"PlayerID":"2","PlayerName":"Tom","GroupName":"React","BeaconID":"2","Team":"alpecin-fenix"},' +
  '{"PlayerID":"3","PlayerName":"Jan","GroupName":"MIT","BeaconID":"3","Team":"astana-premier-tech"},' +
  '{"PlayerID":"4","PlayerName":"Alex","GroupName":"MCT","BeaconID":"4","Team":"bahrain-victorious"},' +
  '{"PlayerID":"5","PlayerName":"Piet","GroupName":"IOT","BeaconID":"5","Team":"bora-hansgrohe"},' +
  '{"PlayerID":"6","PlayerName":"Matt","GroupName":"MCT","BeaconID":"6","Team":"cofidis-solutions-credits"},' +
  '{"PlayerID":"7","PlayerName":"Rob","GroupName":"React","BeaconID":"7","Team":"deceuninck-quick-step"},' +
  '{"PlayerID":"8","PlayerName":"Seppe","GroupName":"MCT","BeaconID":"8","Team":"groupama-fdj"},' +
  '{"PlayerID":"9","PlayerName":"John","GroupName":"IOT","BeaconID":"9","Team":"ineos-grenadiers"},' +
  '{"PlayerID":"10","PlayerName":"Louis","GroupName":"IOT","BeaconID":"10","Team":"israel-start-up-nation"}]}';

const DropdownEtappes = function () {
  // ################################
  // Code dropdown en andere html dingen (van Thibeau)
  // ################################

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

  const createEtappeHTML = function(etappes){
    removeLeaderboard();
    getLeaderboard(etappes);
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

    let html = document.querySelector(".js-etappes")
    html.innerHTML = createEtappeHTML(a0.textContent.slice(0,1));
  }

  function SelectOption2() {
    let a2 = document.getElementById("a2");
    let a0 = document.getElementById("a0");

    if (a0 != a2) {
      let savedWord2 = a0.textContent;
      a0.innerHTML = a2.textContent;
      a2.innerHTML = savedWord2;
    }

    let html = document.querySelector(".js-etappes")
    html.innerHTML = createEtappeHTML(a0.textContent.slice(0,1));
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

  // ################################
  // Code code dropdown en andere html dingen (van Thibeau)
  // ################################

}

function showEtappes(etappes) {
  removeLeaderboard();
  getLeaderboard(etappes);
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

const getLeaderboard = async (etappes) => {
  var result;

  if (etappes == 3) {
    result = resulttbl3
  }
  else if (etappes == 5) {
    result = resulttbl5;
  }
  else if (etappes == 7) {
    result = resulttbl7;
  }

  var object_result = JSON.parse(result);
  var object_player = JSON.parse(playertbl);


  var total_number = Object.keys(object_result.resulttbl).length;

  for (let number = 0; number <= total_number-1; number++) {
    var count = Object.keys(object_player.playertbl).length;

    for (let i = 0; i <= count - 1; i++) {
      var res = object_result.resulttbl[number].PlayerID;
      var pla = object_player.playertbl[i].PlayerID;

      if (res == pla) {

        var team = object_player.playertbl[i].Team;

        var name = object_player.playertbl[i].PlayerName;
        var icon = selectTeam(team);
        var group = object_player.playertbl[i].GroupName;
        var time = object_result.resulttbl[number].Time;
      }
    }
    await createNewRow(number, name, icon, group, time, team);
  }
}

function createNewRow(number, name, icon, group, time, team) {
  const rowEl = document.createElement('tr');
  var rowInnerHTML = "";

  if (number <= 3) {
    showPodium(number, name, team, time);
  }

  if (number == 0) {
    rowEl.classList.add('c-leaderboard-header');
    rowInnerHTML = `
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Icon</th>
      <th>Group</th>
      <th>Time</th>
    </tr>
    `;
  }
  else {
    rowEl.classList.add('c-leaderboard-row');
    rowInnerHTML = `
    <tr class="c-leaderboard-header">
      <td class="c-ranking__fw">${number}</td>
      <td>${name}</td>
      <td>${icon}</td>
      <td>${group}</td>
      <td class="c-time__fw">${time} s</td>
    </tr>
    `;
  }

  rowEl.innerHTML = rowInnerHTML;

  row_container.appendChild(rowEl);
};

function showPodium(number, name, team, time) {
  var first = document.getElementById('first');
  var second = document.getElementById('second');
  var third = document.getElementById('third');

  if (number == 1) {
    const firstInnerHTML = `
    <div class="c-circle" id="first">
        <img class="c-img__1" src="Images/teams/${team}-2021.png" alt="2021">
        <span class="c-podium__name__1">${name}</span>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div> 
    <div class="c-circle__time__1__fz">
      ${time} s
    </div>
    `;
    first.innerHTML = firstInnerHTML;
  }
  else if (number == 2) {
    const secondInnerHTML = `
    <div class="c-circle" id="second">
        <img class="c-img__2" src="Images/teams/${team}-2021.png" alt="2021">
        <p class="c-podium__name__2">${name}</p>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div>
    <div class="c-circle__time__2__fz">
      ${time} s
    </div>
    `;
    second.innerHTML = secondInnerHTML;
  }
  else if (number == 3) {
    const thirdInnerHTML = `
    <div class="c-circle" id="third">
        <img class="c-img__3" src="Images/teams/${team}-2021.png" alt="2021">
        <span class="c-podium__name__3">${name}</span>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div>
    <div class="c-circle__time__3__fz">
      ${time} s
    </div>
    `;
    third.innerHTML = thirdInnerHTML;
  }

};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Script loaded!');
  const row_container = document.getElementById('row_container');
  getLeaderboard(3);
  DropdownEtappes();
>>>>>>> CssV1
});