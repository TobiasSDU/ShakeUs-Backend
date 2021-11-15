const scrollListeners = document.getElementsByClassName('scrollListener');

for (let i = 0; i < scrollListeners.length; i++) {
    scrollListeners[i].addEventListener('click', (event) => {
        const targetElement = event.target.getAttribute('scrollTarget');

        getSectionTitleElement(targetElement).scrollIntoView({
            behavior: 'smooth',
        });
    });
}

const sectionTitles = document.getElementsByClassName('section-title');

const getSectionTitleElement = (titleText) => {
    for (let i = 0; i < sectionTitles.length; i++) {
        const titleElement = sectionTitles[i].getElementsByTagName('h2')[0];

        if (titleElement.innerText == titleText) {
            return sectionTitles[i];
        }
    }
};
