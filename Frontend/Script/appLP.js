// ---------- TESTDATA ----------

const resulttbl = '{"resulttbl":[' +
'{"ResultID":"0","Date":"","":"","PlayerID":"0"},' +
'{"ResultID":"1","Date":"2021","Time":"124","PlayerID":"2"},' +
'{"ResultID":"2","Date":"2021","Time":"129","PlayerID":"4"},' +
'{"ResultID":"3","Date":"2021","Time":"138","PlayerID":"6"},' +
'{"ResultID":"4","Date":"2021","Time":"142","PlayerID":"8"},' +
'{"ResultID":"5","Date":"2021","Time":"145","PlayerID":"10"},' +
'{"ResultID":"6","Date":"2021","Time":"149","PlayerID":"9"},' +
'{"ResultID":"7","Date":"2021","Time":"155","PlayerID":"7"},' +
'{"ResultID":"8","Date":"2021","Time":"156","PlayerID":"5"},' +
'{"ResultID":"9","Date":"2021","Time":"164","PlayerID":"3"},' +
'{"ResultID":"10","Date":"2021","Time":"187","PlayerID":"1"}]}';

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

function selectTeam(team) {
    var team_selected = `<img class="c-img-icon" src="Images/teams/${team}-2021.png" alt="${team}-2021">`;
    return team_selected;
}

const getLeaderboard = async () => {
    var object_result = JSON.parse(resulttbl);
    var object_player = JSON.parse(playertbl);
    var total_number = Object.keys(object_result.resulttbl).length;
    for (let number = 0; number <= total_number; number++) {
        var count = Object.keys(object_player.playertbl).length;

        for (let i = 0; i <= count-1; i++) {
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
      <td>${number}</td>
      <td>${name}</td>
      <td>${icon}</td>
      <td>${group}</td>
      <td>${time}</td>
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

  console.log(team)

  if (number == 1) {
    const firstInnerHTML = `
    <div class="c-circle" id="first">
        <img class="c-img" src="Images/teams/${team}-2021.png" alt="2021">
        <span class="c-podium__name">${name}</span>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div>
    ${time}
    `;
    first.innerHTML = firstInnerHTML;
  }
  else if (number == 2) {
    const secondInnerHTML = `
    <div class="c-circle" id="second">
        <img class="c-img" src="Images/teams/${team}-2021.png" alt="2021">
        <p class="c-podium__name">${name}</p>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div>
    ${time}
    `;
    second.innerHTML = secondInnerHTML;
  }
  else if (number == 3) {
    const thirdInnerHTML = `
    <div class="c-circle" id="third">
        <img class="c-img" src="Images/teams/${team}-2021.png" alt="2021">
        <span class="c-podium__name">${name}</span>
    </div>
    <div class="c-circle c-circle__small">
        <span class="c-podium__number">${number}</span>
    </div>
    ${time}
    `;
    third.innerHTML = thirdInnerHTML;
  }
  else {
    console.log("Niet op het podium");
  }

};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Script loaded!');
  const row_container = document.getElementById('row_container');
  getLeaderboard();
});