// eslint-disable-next-line no-undef
const socket = io();

const button = document.getElementById('CreatePartyButton');
const nameInput = document.getElementById('hostName');
const activityPackId = 'DefaultActivityPack1';
const resultElement = document.getElementById('createPartyResultData');

button.addEventListener('click', async () => {
    const res = await fetch(`${location.protocol}//${location.host}/party`, {
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

    if (res.ok) {
        socket.emit('join-room', data.partyId);
    }

    const hostId = document.createElement('span');
    const partyId = document.createElement('span');

    hostId.innerText = '{ hostId: ' + data.hostId + ', ';
    partyId.innerText = 'partyId: ' + data.partyId + ' }';

    resultElement.appendChild(hostId);
    resultElement.appendChild(partyId);
});

socket.on('user-joined-party', (message) => {
    console.log(message);
});

socket.on('user-left-party', (message) => {
    console.log(message);
});

socket.on('activity-started', (message) => {
    console.log(new Date(Date.now()));
    console.log(message);
});
