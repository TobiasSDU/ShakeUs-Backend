import { defaultActivityPack } from '../templates/default_activity_pack.js';

// eslint-disable-next-line no-undef
let socket = io();

let button = document.getElementById('CreatePartyButton');
let nameInput = document.getElementById('hostName');
let activityPackId = defaultActivityPack._id;
let resultElement = document.getElementById('createPartyResultData');

button.addEventListener('click', async () => {
    const res = await fetch('http://localhost:3000/party/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            activityPackId: activityPackId,
            hostName: nameInput.value,
        }),
    });

    const data = await res.json();

    const hostId = document.createElement('span');
    const partyId = document.createElement('span');

    hostId.innerText = '{ hostId: ' + data.hostId + ', ';
    partyId.innerText = 'partyId: ' + data.partyId + ' }';

    resultElement.appendChild(hostId);
    resultElement.appendChild(partyId);
});

socket.on('user-joined-party', (message) => {
    console.log(message);
    socket.emit('test');
});

socket.on('activity-started', (message) => {
    console.log(new Date(Date.now()));
    console.log(message);
});
