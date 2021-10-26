const scrollListeners = document.getElementsByClassName('scrollListener');

for (let i = 0; i < scrollListeners.length; i++) {
    scrollListeners[i].addEventListener('click', (event) => {
        const targetElement = event.target.getAttribute('scrollTarget');

        getSectionTitleElement(targetElement).scrollIntoView({
            behavior: 'smooth',
        });
    });
}

const sectionTitle = document.getElementsByClassName('section-title');

const getSectionTitleElement = (titleText) => {
    for (let i = 0; i < sectionTitle.length; i++) {
        if (sectionTitle[i].innerText == titleText) {
            return sectionTitle[i];
        }
    }
};
