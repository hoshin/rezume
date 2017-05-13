'use strict';
import _ from 'lodash';

class Rezume {
    constructor(options, resumeData, assignments, document) {
        if (!resumeData) {
            throw new Error('You need to specify some resume data for all this to make sense');
        }
        this.options = options;
        this._originalResumeData = resumeData;

        if (!Array.isArray(assignments)) {
            assignments = [assignments];
        }

        this.assignmentsList = assignments;
        this.assignments = assignments[0];
        this.resumeData = _.merge({}, resumeData, assignments[0].resumeData);
        this.expectedHeaders = assignments[0].expectedHeaders;
        this.updateCVSelector(assignments, document);

        if(!this.expectedHeaders){
            this.expectedHeaders = ['twitter', 'github', 'email', 'name', 'addressLine1', 'addressLine2', 'position', 'phone', 'picture'];
        }
    }

    getDocument() {
        return document;
    }

    selectorChange() {
        const currentDocument = this.getDocument();
        const selectorValue = currentDocument.getElementById('cv_selector').value;
        this.assignments = this.assignmentsList[selectorValue];
        this.resumeData = _.merge({}, this._originalResumeData, this.assignmentsList[selectorValue].resumeData);
        this.render(currentDocument);
    }

    updateCVSelector(assignmentsArray, document) {
        if(document){
            const selector = document.getElementById('cv_selector');
            selector.setAttribute('style', 'display:block');

            assignmentsArray.forEach((assignmentsList, key) => {
                const selectorOption = document.createElement('option');
                selectorOption.setAttribute('value', key);
                selectorOption.innerText = `Version ${assignmentsList.name || key}`;
                selector.appendChild(selectorOption);
            });
        }
    }

    render() {
        const document = this.getDocument();
        const resumeData = this.resumeData;
        const resumeOptions = this.options;

        document.title = resumeData.title;
        this.renderHeader(resumeData, document);
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
        if(!resumeData.annex){
            document.getElementById('annexTitle').innerText = '';
            document.getElementById('skillsTitle').innerText = '';
            return;
        }
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
            targetSectionList.innerHTML = '';
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
            otherSkillsList.innerHTML = '';
            this.appendItemsToDOMList(resumeData.annex.skills[skillSectionName].list, document, otherSkillsList);
        }
    }

    renderAssignments(document, resumeData, resumeOptions, sectionIdPrefix) {
        const resumeDataAssignmentsSection = resumeData[`${sectionIdPrefix}Assignments`];
        if(!resumeDataAssignmentsSection){
            document.getElementById(`${sectionIdPrefix}AssignmentsTitle`).innerText = '';
            document.getElementById(`${sectionIdPrefix}AssignmentsComment`).innerText = '';
            return;
        }

        document.getElementById(`${sectionIdPrefix}AssignmentsTitle`).innerText = resumeDataAssignmentsSection.title;
        document.getElementById(`${sectionIdPrefix}AssignmentsComment`).innerText = resumeDataAssignmentsSection.comment;

        const relevantAssignmentsListContainer = document.getElementById(`${sectionIdPrefix}AssignmentsList`);
        relevantAssignmentsListContainer.innerHTML = '';

        resumeDataAssignmentsSection.list.forEach(assignmentName => {
            if (this.assignments[assignmentName]) {
                this.appendAssignmentToList(document, this.assignments[assignmentName], resumeOptions.showKeywords, relevantAssignmentsListContainer);
            }
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
        if(!resumeData.academic){
            document.getElementById('academicTitle').innerText = '';
            document.getElementById('academic').innerHTML = '';
            return;
        }
        document.getElementById('academicTitle').innerText = resumeData.academicTitle;
        const academicContainer = document.getElementById('academic');
        academicContainer.innerHTML = '';
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

    renderHeader(resumeData, document) {
        if(!resumeData.header){
            return;
        }
        this.hideUnspecifiedHeaders(Object.keys(resumeData.header), document);

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
                    document.getElementById(optionName).innerHTML = resumeData.header[optionName];
                }
            }
        );
    }

    hideUnspecifiedHeaders(resumeDataHeaderElements, document) {
        const validHeaders = _.intersection(this.expectedHeaders, resumeDataHeaderElements);

        validHeaders.forEach( validHeaderElement => {
            document.getElementById(`${validHeaderElement}Container`).setAttribute('style', 'display:block');
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
