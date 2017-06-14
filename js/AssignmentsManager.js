'use strict';
import utils from './utils'

class AssignmentsManager {
    constructor(assignments) {
        this.assignments = assignments;
    }

    renderAssignments(resumeData, resumeOptions, sectionIdPrefix) {
        const document = utils.getDocument();
        const resumeDataAssignmentsSection = resumeData[`${sectionIdPrefix}Assignments`];
        if (!resumeDataAssignmentsSection) {
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

    updateAssignmentsData(newAssignments){
        this.assignments = newAssignments
    }

    appendAssignmentToList(assignment, showKeywords, relevantAssignmentsListContainer) {
        const document = utils.getDocument();
        const assignmentContainer = document.createElement('div');
        assignmentContainer.setAttribute('class', 'mission');

        assignmentContainer.appendChild(this.createAssignmentLogoFrame(assignment));
        assignmentContainer.appendChild(this.createAssignmentDescription(assignment, showKeywords));
        relevantAssignmentsListContainer.appendChild(assignmentContainer);
    }

    createAssignmentDescription(assignment, showKeywords) {
        const document = utils.getDocument();
        const assignmentDescription = document.createElement('div');
        assignmentDescription.setAttribute('class', 'mission-desc');

        const assignmentDescriptionTitle = document.createElement('h2');
        assignmentDescriptionTitle.innerText = assignment.title;

        const assignmentDescriptionParagraph = document.createElement('p');
        assignmentDescriptionParagraph.innerHTML = assignment.shortDescription || '';

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
        const document = utils.getDocument();

        const assignmentLogoTime = document.createElement('div');
        assignmentLogoTime.setAttribute('class', 'mission-logo-time');
        const assignmentImage = document.createElement('img');

        assignmentImage.setAttribute('src', utils.lookupPicture(assignment.logo, document));
        assignmentImage.setAttribute('alt', assignment.logoAlt);
        const assignmentDuration = document.createElement('p');
        assignmentDuration.innerText = assignment.duration;

        assignmentLogoTime.appendChild(assignmentImage);
        assignmentLogoTime.appendChild(assignmentDuration);
        return assignmentLogoTime;
    }
}

export default AssignmentsManager;