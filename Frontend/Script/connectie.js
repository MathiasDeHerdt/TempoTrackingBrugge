const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
console.log(lanIP)

var playerCount = 0;
var etappeCount = 0;

const listenToSocket = function () {
    socket.on('connected', function () {
        console.log('Verbonden met de socket');
    });

    socket.on('B2F_game_settings', function (data) {
        console.log(data)
    })
}

const init = function () {
    listenToSocket();
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM - connectie')

    // hier stuur ik naar de backend een ack dat in de back een emit gaat sturen
    const youCanSend = "ack"
    socket.emit('F2B_send_player_count', youCanSend)

    init();
});






