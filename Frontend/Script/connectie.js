const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

console.log(socket)
console.log(lanIP)