function loadScript(path) {
    let body = document.getElementsByTagName('body')[0];
    let script = document.createElement('script');
    script.type = 'module';
    script.src = path;
    body.appendChild(script);
}

loadScript('./scripts/sidebar-scroll-listeners.js');
loadScript('./scripts/adjust-code-snippet-size.js');

// eslint-disable-next-line no-undef
const socket = io();

socket.emit('join-room', 'gj8b4p0');

socket.on('activity-title-updated', (message) => {
    console.log(new Date(Date.now()));
    console.log(message);
});
