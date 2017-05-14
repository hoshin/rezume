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
        this.renderHeader(resumeData);
        this.renderAbout(resumeData.about);
        this.renderAcademic(resumeData);
        this.renderAssignments(resumeData, resumeOptions, 'relevant');
        if (resumeOptions.showOtherAssignments) {
            document.getElementById('otherAssignmentsList').setAttribute('style', 'display:block');
            document.getElementById('otherAssignments').setAttribute('style', 'display:block');
            this.renderAssignments(resumeData, resumeOptions, 'other')
        }
        this.renderAnnex(resumeData);
    }

    renderAnnex(resumeData) {
        const document = this.getDocument();
        if(!resumeData.annex){
            document.getElementById('annexTitle').innerText = '';
            document.getElementById('skillsTitle').innerText = '';
            return;
        }
        document.getElementById('annexTitle').innerText = resumeData.annex.title;
        document.getElementById('skillsTitle').innerText = resumeData.annex.skills.title;
        this.renderAnnexSkillsSection(resumeData, 'tech');
        this.renderAnnexSkillsSection(resumeData, 'architecture');
        this.renderAnnexSkillsSection(resumeData, 'methodologies');
        this.renderAnnexSkillsSection(resumeData, 'other');
        this.renderAnnexBigSection(resumeData, 'publications');
        this.renderAnnexBigSection(resumeData, 'misc');
    }

    renderAnnexBigSection(resumeData, sectionName) {
        const document = this.getDocument();
        document.getElementById(sectionName + 'Title').innerText = resumeData.annex[sectionName].title;
        const targetSectionList = document.getElementById(sectionName + 'List');

        if (targetSectionList) {
            targetSectionList.innerHTML = '';
            this.appendItemsToDOMList(resumeData.annex[sectionName].list, targetSectionList);
        }
    }

    appendItemsToDOMList(skillsFromResumeData, DOMElementToAppendTo) {
        const document = this.getDocument();
        skillsFromResumeData.forEach((skill) => {
            const otherSkillItem = document.createElement('li');
            otherSkillItem.innerHTML = skill;
            DOMElementToAppendTo.appendChild(otherSkillItem);
        });
    }

    renderAnnexSkillsSection(resumeData, skillSectionName) {
        const document = this.getDocument();
        document.getElementById(skillSectionName + 'SkillsTitle').innerText = resumeData.annex.skills[skillSectionName].title;
        const otherSkillsList = document.getElementById(skillSectionName + 'SkillsList');

        if (otherSkillsList) {
            otherSkillsList.innerHTML = '';
            this.appendItemsToDOMList(resumeData.annex.skills[skillSectionName].list, otherSkillsList);
        }
    }

    renderAssignments(resumeData, resumeOptions, sectionIdPrefix) {
        const document = this.getDocument();
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
                this.appendAssignmentToList(this.assignments[assignmentName], resumeOptions.showKeywords, relevantAssignmentsListContainer);
            }
        });
    }

    appendAssignmentToList(assignment, showKeywords, relevantAssignmentsListContainer) {
        const document = this.getDocument();
        const assignmentContainer = document.createElement('div');
        assignmentContainer.setAttribute('class', 'mission');

        assignmentContainer.appendChild(this.createAssignmentLogoFrame(assignment));
        assignmentContainer.appendChild(this.createAssignmentDescription(assignment, showKeywords));
        relevantAssignmentsListContainer.appendChild(assignmentContainer);
    }

    createAssignmentDescription(assignment, showKeywords) {
        const document = this.getDocument();
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

    createAssignmentLogoFrame(assignment) {
        const document = this.getDocument();

        const assignmentLogoTime = document.createElement('div');
        assignmentLogoTime.setAttribute('class', 'mission-logo-time');
        const assignmentImage = document.createElement('img');

        assignmentImage.setAttribute('src', this.lookupPicture(assignment.logo));
        assignmentImage.setAttribute('alt', assignment.logoAlt);
        const assignmentDuration = document.createElement('p');
        assignmentDuration.innerText = assignment.duration;

        assignmentLogoTime.appendChild(assignmentImage);
        assignmentLogoTime.appendChild(assignmentDuration);
        return assignmentLogoTime;
    }

    renderAcademic(resumeData) {
        const document = this.getDocument();
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

    renderAbout(aboutData) {
        const document = this.getDocument();
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

    renderHeader(resumeData) {
        const document = this.getDocument();
        if(!resumeData.header){
            return;
        }
        this.hideUnspecifiedHeaders(Object.keys(resumeData.header));

        Object.keys(resumeData.header).forEach((optionName) => {
                if (optionName === 'picture') {
                    document.getElementById('picture').setAttribute('src', this.lookupPicture(resumeData.header['picture']));
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
        const document = this.getDocument();
        const validHeaders = _.intersection(this.expectedHeaders, resumeDataHeaderElements);

        validHeaders.forEach( validHeaderElement => {
            document.getElementById(`${validHeaderElement}Container`).setAttribute('style', 'display:block');
        });
    }

    lookupPicture(location) {
        const document = this.getDocument();

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
