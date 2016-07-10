'use strict';
class Rezume {
    constructor(options, resumeData) {
        this.options = options;
        this.resumeData = resumeData;
    }

    render(document) {
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
        var targetSectionList = document.getElementById(sectionName + 'List');
        if (targetSectionList) {
            this.appendItemsToDOMList(resumeData.annex[sectionName].list, document, targetSectionList);
        }
    }

    appendItemsToDOMList(skillsFromResumeData, document, DOMElementToAppendTo) {
        skillsFromResumeData.forEach(function (skill) {
            var otherSkillItem = document.createElement('li');
            otherSkillItem.innerHTML = skill;
            DOMElementToAppendTo.appendChild(otherSkillItem);
        });
    }

    renderAnnexSkillsSection(document, resumeData, skillSectionName) {
        document.getElementById(skillSectionName + 'SkillsTitle').innerText = resumeData.annex.skills[skillSectionName].title;
        var otherSkillsList = document.getElementById(skillSectionName + 'SkillsList');
        if (otherSkillsList) {
            this.appendItemsToDOMList(resumeData.annex.skills[skillSectionName].list, document, otherSkillsList);
        }
    }

    renderAssignments(document, resumeData, resumeOptions, sectionIdPrefix) {
        document.getElementById(`${sectionIdPrefix}AssignmentsTitle`).innerText =   resumeData[`${sectionIdPrefix}Assignments`].title;
        document.getElementById(`${sectionIdPrefix}AssignmentsComment`).innerText = resumeData[`${sectionIdPrefix}Assignments`].comment;

        var relevantAssignmentsListContainer = document.getElementById(`${sectionIdPrefix}AssignmentsList`);
        resumeData[`${sectionIdPrefix}Assignments`].list.forEach( (assignment) => {
            this.appendAssignmentToList(document, assignment, resumeOptions.showKeywords, relevantAssignmentsListContainer);
        });
    }

    appendAssignmentToList(document, assignment, showKeywords, relevantAssignmentsListContainer) {
        var assignmentContainer = document.createElement('div');
        assignmentContainer.setAttribute('class', 'mission');

        var assignmentLogoTime = document.createElement('div');
        assignmentLogoTime.setAttribute('class', 'mission-logo-time');
        var assignmentImage = document.createElement('img');
        assignmentImage.setAttribute('src', document.getElementById(assignment.logo).getAttribute('src'));
        assignmentImage.setAttribute('alt', assignment.logoAlt);
        var assignmentDuration = document.createElement('p');
        assignmentDuration.innerText = assignment.duration;

        assignmentLogoTime.appendChild(assignmentImage);
        assignmentLogoTime.appendChild(assignmentDuration);

        var assignmentDescription = document.createElement('div');
        assignmentDescription.setAttribute('class', 'mission-desc');

        var assignmentDescriptionTitle = document.createElement('h2');
        assignmentDescriptionTitle.innerText = assignment.title;

        var assignmentDescriptionParagraph = document.createElement('p');
        assignmentDescriptionParagraph.innerHTML = assignment.shortDescription;
        var assignmentDescriptionKeywords = document.createElement('p');
        assignmentDescriptionKeywords.setAttribute('class', 'mission-keywords');
        assignmentDescriptionKeywords.innerText = assignment.keywords;

        assignmentDescription.appendChild(assignmentDescriptionTitle);
        assignmentDescription.appendChild(assignmentDescriptionParagraph);
        if (showKeywords) {
            assignmentDescription.appendChild(assignmentDescriptionKeywords);
        }

        assignmentContainer.appendChild(assignmentLogoTime);
        assignmentContainer.appendChild(assignmentDescription);

        relevantAssignmentsListContainer.appendChild(assignmentContainer);
    }

    renderAcademic(document, resumeData) {
        document.getElementById('academicTitle').innerText = resumeData.academicTitle;
        var academicContainer = document.getElementById('academic');
        resumeData.academic.forEach(function (educationItem) {

            if (educationItem.show) {
                var academicItem = document.createElement('p');
                var academicTitle = document.createElement('b');
                academicTitle.innerText = educationItem.title;
                var academicDescription = document.createElement('span');
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
        Object.keys(resumeData.header).forEach(function (optionName) {
                if (optionName === 'picture') {
                    document.getElementById('picture').setAttribute('src', document.getElementById(resumeData.header['picture']).getAttribute('src'));
                } else if (optionName === 'twitter') {
                    const twitterElement = document.getElementById(optionName);
                    twitterElement.innerText = '@' + resumeData.header[optionName];
                    twitterElement.setAttribute('href', `https://twitter.com/${resumeData.header[optionName]}`);
                } else if (optionName === 'email') {
                    const emailElement = document.getElementById(optionName);
                    emailElement.innerText = resumeData.header[optionName];
                    emailElement.setAttribute('href', `mailto:${resumeData.header[optionName]}`);
                } else if(optionName === 'github'){
                    const githubElement = document.getElementById(optionName);
                    githubElement.innerText = `https://github.com/${resumeData.header[optionName]}`;
                    githubElement.setAttribute('href', `https://github.com/${resumeData.header[optionName]}`);
                }else {
                    document.getElementById(optionName).innerText = resumeData.header[optionName];
                }
            }
        );
    }
}

export {Rezume};
