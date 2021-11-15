window.addEventListener('load', function () {
    const preElements = document.getElementsByTagName('pre');

    for (let i = 0; i < preElements.length; i++) {
        const codeElement = preElements[i].getElementsByTagName('code')[0];
        const codeElementHeight = codeElement.offsetHeight;

        if (!codeElement.classList.contains('no-js-formatting')) {
            codeElement.style.height = codeElementHeight - 64 + 'px';
            preElements[i].style.height = codeElementHeight - 56 + 'px';
        }
    }
});
