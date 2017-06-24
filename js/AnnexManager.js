'use strict';
import utils from './utils'

class AnnexManager {
    renderAnnex(resumeData) {
        const document = utils.getDocument();
        const annexData = resumeData.annex;
        if (!annexData || !annexData.title) {
            document.getElementById('annexTitle').innerText = '';
            document.getElementById('skillsTitle').innerText = '';
            return;
        }
        document.getElementById('annexTitle').innerText = annexData.title;
        if(annexData.skills){
            document.getElementById('skillsTitle').innerText = annexData.skills.title;
            document.getElementById('skillsContent').innerHTML = '';
            const skillSectionsToRender = Object.keys(annexData.skills).filter(skill => skill !== 'title');
            skillSectionsToRender.forEach((skillSectionToRender, index) => {
                this.renderAnnexSkillsSection(resumeData, skillSectionToRender);
                if(index%2 === 1 && index+1 < skillSectionsToRender.length){
                    this.addSkillsDivider(document);
                }
            });
        }
        if(annexData.publications){
            this.renderAnnexBigSection(resumeData, 'publications');
        }
        if(annexData.misc){
            this.renderAnnexBigSection(resumeData, 'misc');
        }
    }

    addSkillsDivider(document) {
        const skillsSectionDOM = document.getElementById('skillsContent');
        const separator = document.createElement('div');
        separator.setAttribute('class', 'divider');
        skillsSectionDOM.append(separator);
    }

    renderAnnexBigSection(resumeData, sectionName) {
        const document = utils.getDocument();
        document.getElementById(sectionName + 'Title').innerText = resumeData.annex[sectionName].title;
        const targetSectionList = document.getElementById(sectionName + 'List');

        if (targetSectionList) {
            targetSectionList.innerHTML = '';
            this.appendItemsToDOMList(resumeData.annex[sectionName].list, targetSectionList);
        }
    }

    renderAnnexSkillsSection(resumeData, skillSectionName) {
        const document = utils.getDocument();
        const {skillSectionDOM, skillsSectionListDOM} = this.createDOMSkillSection(skillSectionName, resumeData);

        this.appendItemsToDOMList(resumeData.annex.skills[skillSectionName].list, skillsSectionListDOM);
        document.getElementById('skillsContent').append(skillSectionDOM)
    }

    createDOMSkillSection(skillSectionName, resumeData) {
        const document = utils.getDocument();

        const skillSectionDOM = document.createElement('div');
        skillSectionDOM.setAttribute('class', 'bloc bloc-competence');

        const skillsSectionTitleDOM = document.createElement('h2');
        skillsSectionTitleDOM.setAttribute('id', `${skillSectionName}SkillsTitle`);
        skillsSectionTitleDOM.innerText = resumeData.annex.skills[skillSectionName].title;

        const skillsSectionListDOM = document.createElement('ul');
        skillsSectionListDOM.setAttribute('id', `${skillSectionName}SkillsList`);
        skillsSectionListDOM.innerHTML = '';

        skillSectionDOM.append(skillsSectionTitleDOM);
        skillSectionDOM.append(skillsSectionListDOM);
        return {skillSectionDOM, skillsSectionListDOM};
    }

    appendItemsToDOMList(skillsFromResumeData, DOMElementToAppendTo) {
        skillsFromResumeData.forEach((skill) => {
            const otherSkillItem = utils.getDocument().createElement('li');
            otherSkillItem.innerHTML = skill;
            DOMElementToAppendTo.appendChild(otherSkillItem);
        });
    };
}

export default AnnexManager;