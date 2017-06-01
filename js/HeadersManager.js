'use strict';
import utils from './utils'
import _ from 'lodash';

class HeadersManager {
    constructor(givenExpectedHeaders) {
        this.expectedHeaders = givenExpectedHeaders;
        if (!this.expectedHeaders) {
            this.expectedHeaders = ['twitter', 'github', 'email', 'name', 'addressLine1', 'addressLine2', 'position', 'phone', 'picture'];
        }
    }

    updateHeadersData(assignmentsData) {
        this.expectedHeaders = assignmentsData;
    }

    renderHeader(resumeData) {
        const document = utils.getDocument();
        if (!resumeData.header) {
            return;
        }
        this.hideUnspecifiedHeaders(Object.keys(resumeData.header));

        Object.keys(resumeData.header).forEach((optionName) => {
                if (optionName === 'picture') {
                    document.getElementById('picture').setAttribute('src', utils.lookupPicture(resumeData.header['picture'], document));
                } else if (optionName === 'twitter') {
                    const twitterElement = document.getElementById(optionName);
                    twitterElement.innerText = '@' + resumeData.header[optionName];
                    twitterElement.setAttribute('href', `https://twitter.com/${resumeData.header[optionName]}`);
                } else if (optionName === 'email') {
                    const emailElement = document.getElementById(optionName);
                    emailElement.innerText = resumeData.header[optionName];
                    emailElement.setAttribute('href', `mailto:${resumeData.header[optionName]}`);
                } else if (optionName === 'github') {
                    const githubElement = document.getElementById(optionName);
                    githubElement.innerText = `https://github.com/${resumeData.header[optionName]}`;
                    githubElement.setAttribute('href', `https://github.com/${resumeData.header[optionName]}`);
                } else {
                    document.getElementById(optionName).innerHTML = resumeData.header[optionName];
                }
            }
        );
    }

    hideUnspecifiedHeaders(resumeDataHeaderElements) {
        const document = utils.getDocument();
        const validHeaders = _.intersection(this.expectedHeaders, resumeDataHeaderElements);

        validHeaders.forEach(validHeaderElement => {
            document.getElementById(`${validHeaderElement}Container`).setAttribute('style', 'display:block');
        });
    }
}

export default HeadersManager;
