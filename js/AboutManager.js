'use strict';
import utils from './utils'

class AboutManager {
    renderAbout(aboutData) {
        const document = utils.getDocument();
        const aboutTitle = document.getElementById('aboutTitle');
        const aboutContents = document.getElementById('aboutContents');
        if(aboutData){
            aboutTitle.innerText = aboutData.title;
            aboutContents.innerHTML = aboutData.contents;
        } else {
            aboutTitle.innerText = '';
            aboutContents.innerHTML = '';
        }
    }
}

export default AboutManager;