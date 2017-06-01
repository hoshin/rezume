'use strict';
import utils from './utils'

class AcademicManager {
    renderAcademic(resumeData) {
        const document = utils.getDocument();
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
}

export default AcademicManager;