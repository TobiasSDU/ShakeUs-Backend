function loadScript(path) {
    let body = document.getElementsByTagName('body')[0];
    let script = document.createElement('script');
    script.type = 'module';
    script.src = path;
    body.appendChild(script);
}

loadScript('./scripts/create-party.js');
loadScript('./scripts/display-default-activity-pack.js');
