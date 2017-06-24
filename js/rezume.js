'use strict';
import _ from 'lodash';
import AnnexManager from './AnnexManager';
import AssignmentsManager from './AssignmentsManager';
import AcademicManager from './AcademicManager.js';
import AboutManager from './AboutManager.js';
import HeadersManager from './HeadersManager';
import utils from './utils';

class Rezume {
    constructor(options, resumeData, assignments, document) {
        this.annexManager = new AnnexManager(utils.getDocument);
        this.academicManager = new AcademicManager();
        this.aboutManager = new AboutManager();

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
        this.updateCVSelector(assignments, document);
        this.assignmentsManager = new AssignmentsManager(this.assignments);
        this.headersManager = new HeadersManager(this.assignments.expectedHeaders);
    }

    selectorChange() {
        const currentDocument = utils.getDocument();
        const selectorValue = currentDocument.getElementById('cv_selector').value;
        this.assignments = this.assignmentsList[selectorValue];
        this.assignmentsManager.updateAssignmentsData(this.assignments);
        //this.headersManager.updateHeadersData(this.assignments.expectedHeaders);
        this.resumeData = _.merge({}, this._originalResumeData, this.assignmentsList[selectorValue].resumeData);
        this.headersManager.updateHeadersData(this.assignments.expectedHeaders, this.resumeData);
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
        const document = utils.getDocument();
        const resumeData = this.resumeData;
        const resumeOptions = this.options;

        document.title = resumeData.title;
        this.headersManager.renderHeader(resumeData);
        this.aboutManager.renderAbout(resumeData.about);
        this.academicManager.renderAcademic(resumeData);
        this.assignmentsManager.renderAssignments(resumeData, resumeOptions, 'relevant');
        if (resumeOptions.showOtherAssignments) {
            document.getElementById('otherAssignmentsList').setAttribute('style', 'display:block');
            document.getElementById('otherAssignments').setAttribute('style', 'display:block');
            this.assignmentsManager.renderAssignments(resumeData, resumeOptions, 'other')
        }
        this.annexManager.renderAnnex(resumeData);
    }
}

export {Rezume};
