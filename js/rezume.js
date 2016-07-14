'use strict';
class Rezume {
    constructor(options, resumeData) {
        if (!resumeData) {
            throw new Error('You need to specify some resume data for all this to make sense');
        }
        this.options = options;
        this.resumeData = resumeData;
        this.expectedHeaders = ['twitter', 'github', 'email', 'name', 'position', 'addressLine1', 'addressLine2', 'phone', 'picture']
    }

    render(document) {
        const resumeData = this.resumeData;
        const resumeOptions = this.options;

        document.title = resumeData.title;
        this.renderHeader(resumeData, document);
        this.hideUnspecifiedHeaders(Object.keys(resumeData.header), document);
        this.renderAbout(document, resumeData.about);
        this.renderAcademic(document, resumeData);
        this.renderAssignments(document, resumeData, resumeOptions, 'relevant');
        if (resumeOptions.showOtherAssignments) {
            document.getElementById('otherAssignmentsList').setAttribute('style', 'display:block');
            document.getElementById('otherAssignments').setAttribute('style', 'display:block');
            this.renderAssignments(document, resumeData, resumeOptions, 'other')
        }
        this.renderAnnex(document, resumeData);
    }

    renderAnnex(document, resumeData) {
        document.getElementById('annexTitle').innerText = resumeData.annex.title;
        document.getElementById('skillsTitle').innerText = resumeData.annex.skills.title;
        this.renderAnnexSkillsSection(document, resumeData, 'tech');
        this.renderAnnexSkillsSection(document, resumeData, 'architecture');
        this.renderAnnexSkillsSection(document, resumeData, 'methodologies');
        this.renderAnnexSkillsSection(document, resumeData, 'other');
        this.renderAnnexBigSection(document, resumeData, 'publications');
        this.renderAnnexBigSection(document, resumeData, 'misc');
    }

    renderAnnexBigSection(document, resumeData, sectionName) {
        document.getElementById(sectionName + 'Title').innerText = resumeData.annex[sectionName].title;
        const targetSectionList = document.getElementById(sectionName + 'List');
        if (targetSectionList) {
            this.appendItemsToDOMList(resumeData.annex[sectionName].list, document, targetSectionList);
        }
    }

    appendItemsToDOMList(skillsFromResumeData, document, DOMElementToAppendTo) {
        skillsFromResumeData.forEach((skill) => {
            const otherSkillItem = document.createElement('li');
            otherSkillItem.innerHTML = skill;
            DOMElementToAppendTo.appendChild(otherSkillItem);
        });
    }

    renderAnnexSkillsSection(document, resumeData, skillSectionName) {
        document.getElementById(skillSectionName + 'SkillsTitle').innerText = resumeData.annex.skills[skillSectionName].title;
        const otherSkillsList = document.getElementById(skillSectionName + 'SkillsList');
        if (otherSkillsList) {
            this.appendItemsToDOMList(resumeData.annex.skills[skillSectionName].list, document, otherSkillsList);
        }
    }

    renderAssignments(document, resumeData, resumeOptions, sectionIdPrefix) {
        document.getElementById(`${sectionIdPrefix}AssignmentsTitle`).innerText = resumeData[`${sectionIdPrefix}Assignments`].title;
        document.getElementById(`${sectionIdPrefix}AssignmentsComment`).innerText = resumeData[`${sectionIdPrefix}Assignments`].comment;

        const relevantAssignmentsListContainer = document.getElementById(`${sectionIdPrefix}AssignmentsList`);
        resumeData[`${sectionIdPrefix}Assignments`].list.forEach((assignment) => {
            this.appendAssignmentToList(document, assignment, resumeOptions.showKeywords, relevantAssignmentsListContainer);
        });
    }

    appendAssignmentToList(document, assignment, showKeywords, relevantAssignmentsListContainer) {
        const assignmentContainer = document.createElement('div');
        assignmentContainer.setAttribute('class', 'mission');

        assignmentContainer.appendChild(this.createAssignmentLogoFrame(document, assignment));
        assignmentContainer.appendChild(this.createAssignmentDescription(document, assignment, showKeywords));

        relevantAssignmentsListContainer.appendChild(assignmentContainer);
    }

    createAssignmentDescription(document, assignment, showKeywords) {
        const assignmentDescription = document.createElement('div');
        assignmentDescription.setAttribute('class', 'mission-desc');

        const assignmentDescriptionTitle = document.createElement('h2');
        assignmentDescriptionTitle.innerText = assignment.title;

        const assignmentDescriptionParagraph = document.createElement('p');
        assignmentDescriptionParagraph.innerHTML = assignment.shortDescription;

        assignmentDescription.appendChild(assignmentDescriptionTitle);
        assignmentDescription.appendChild(assignmentDescriptionParagraph);

        if (showKeywords) {
            const assignmentDescriptionKeywords = document.createElement('p');
            assignmentDescriptionKeywords.setAttribute('class', 'mission-keywords');
            assignmentDescriptionKeywords.innerText = assignment.keywords;
            assignmentDescription.appendChild(assignmentDescriptionKeywords);
        }

        return assignmentDescription;
    }

    createAssignmentLogoFrame(document, assignment) {
        const assignmentLogoTime = document.createElement('div');
        assignmentLogoTime.setAttribute('class', 'mission-logo-time');
        const assignmentImage = document.createElement('img');

        assignmentImage.setAttribute('src', this.lookupPicture(assignment.logo, document));
        assignmentImage.setAttribute('alt', assignment.logoAlt);
        const assignmentDuration = document.createElement('p');
        assignmentDuration.innerText = assignment.duration;

        assignmentLogoTime.appendChild(assignmentImage);
        assignmentLogoTime.appendChild(assignmentDuration);
        return assignmentLogoTime;
    }

    renderAcademic(document, resumeData) {
        document.getElementById('academicTitle').innerText = resumeData.academicTitle;
        const academicContainer = document.getElementById('academic');
        resumeData.academic.forEach((educationItem) => {

            if (educationItem.show) {
                const academicItem = document.createElement('p');
                const academicTitle = document.createElement('b');
                academicTitle.innerText = educationItem.title;
                const academicDescription = document.createElement('span');
                academicDescription.setAttribute('style', 'margin-left:10px;');
                academicDescription.innerText = `${educationItem.description} - ${educationItem.year}`;
                academicItem.appendChild(academicTitle);
                academicItem.appendChild(academicDescription);
                academicContainer.appendChild(academicItem);
            }
        });
    }

    renderAbout(document, aboutData) {
        document.getElementById('aboutTitle').innerText = aboutData.title;
        document.getElementById('aboutContents').innerText = aboutData.contents;
    }

    renderHeader(resumeData, document) {
        Object.keys(resumeData.header).forEach((optionName) => {
                if (optionName === 'picture') {
                    document.getElementById('picture').setAttribute('src', this.lookupPicture(resumeData.header['picture'], document));
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
                    document.getElementById(optionName).innerText = resumeData.header[optionName];
                }
            }
        );
    }

    hideUnspecifiedHeaders(headersList, document) {
        const headersToHide = this.expectedHeaders.filter((expectedHeader) => {
            return headersList.indexOf(expectedHeader) < 0;
        });

        headersToHide.forEach((headerElementToHideId) => {
            document.getElementById(`${headerElementToHideId}Container`).setAttribute('style', 'display:none');
        });
    }

    lookupPicture(location, document) {
        if (location.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]+-?)*[a-z0-9]+)(?:\.(?:[a-z0-9]+-?)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/)) {
            return location;
        } else {
            const pictureElement = document.getElementById(location);
            if (pictureElement) {
                return pictureElement.getAttribute('src');
            } else {
                return '';
            }
        }
    }
}

export {Rezume};
