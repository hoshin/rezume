import {assert} from 'chai'
import AboutManager from '../js/AboutManager';
import sinon from 'sinon';
import utils from '../js/utils'

describe('AboutManager ', () => {
    let aboutManager, getDocumentStub;
    beforeEach(() => {
        aboutManager = new AboutManager();
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
       utils.getDocument.restore();
    });

    describe('renderAbout', () => {
        it('should set title and contents innerTexts of the about section', () => {
            //setup
            const aboutData = {title: 'foo', contents: 'bar'};
            const aboutTitle = {innerText: 'title'};
            const aboutContents = {innerText: 'contents'};
            const document = {
                getElementById: () => {
                    return {foo: 'baz'}
                }
            };
            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withArgs('aboutTitle').returns(aboutTitle);
            documentMock.expects('getElementById').withArgs('aboutContents').returns(aboutContents);
            getDocumentStub.returns(document);

            //action
            aboutManager.renderAbout(aboutData);
            //assert
            assert.equal(aboutTitle.innerText, 'foo');
            assert.equal(aboutContents.innerHTML, 'bar');
            documentMock.verify();
        });

        it('should not render the about section if there is no about data to render', () => {
            //setup
            const aboutTitle = {innerText: ''};
            const aboutContents = {innerHTML: ''};
            const document = {
                getElementById: () => {
                    return {foo: 'baz'}
                }
            };
            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withArgs('aboutTitle').returns(aboutTitle);
            documentMock.expects('getElementById').withArgs('aboutContents').returns(aboutContents);
            getDocumentStub.returns(document);

            //action
            aboutManager.renderAbout();
            //assert
            assert.equal(aboutTitle.innerText, '');
            assert.equal(aboutContents.innerHTML, '');
            documentMock.verify();
        });
    });
});