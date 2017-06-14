import {assert} from 'chai'
import AcademicManager from '../js/AcademicManager';
import sinon from 'sinon';
import utils from '../js/utils'

describe('AcademicManager ', () => {
    let academicManager, getDocumentStub;
    beforeEach(() => {
        academicManager = new AcademicManager();
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
        utils.getDocument.restore();
    });

    describe('renderAcademic', () => {
        it('should not create any elements if none have a "show" flag', () => {
            //setup
            const document = {
                getElementById: () => {
                    throw new Error('mock not set up')
                }, createElement: sinon.spy()
            };
            const title = {innerText: ''};
            const getElementByIdMock = sinon.mock(document);
            const resumeData = {academic: [{first: 'item'}, {second: 'item'}], academicTitle: 'academic title'};
            const academicContainer = {appendChild: sinon.spy()};

            getElementByIdMock.expects('getElementById').withArgs('academic').returns(academicContainer);
            getElementByIdMock.expects('getElementById').withArgs('academicTitle').returns(title);
            getDocumentStub.returns(document);

            //action
            academicManager.renderAcademic(resumeData);
            //assert
            assert.equal(document.createElement.called, false);
            assert.equal(academicContainer.appendChild.called, false);
            getElementByIdMock.verify();
            assert.deepEqual(title.innerText, 'academic title');
        });

        it('should append the 2 elements that have a "show" flag', () => {
            //setup
            const document = {
                getElementById: () => {
                    throw new Error('mock not set up')
                }, createElement: () => {
                    throw new Error('mock not set up')
                }
            };
            const title = {innerText: ''};
            const documentMock = sinon.mock(document);
            const resumeData = {
                academic: [{
                    first: 'item',
                    description: '1st item',
                    year: 2016,
                    show: true
                }, {second: 'item'}, {
                    third: 'item',
                    description: '3rd item',
                    year: 2016,
                    show: true
                }, {fourth: 'item'}],
                academicTitle: 'academic title'
            };
            const academicContainer = {appendChild: sinon.spy()};

            documentMock.expects('getElementById').withArgs('academic').returns(academicContainer);
            documentMock.expects('getElementById').withArgs('academicTitle').returns(title);

            const firstParagraph = {appendChild: sinon.spy()};
            const secondParagraph = {appendChild: sinon.spy()};
            const firstBold = {innertext: 'unchanged first'};
            const secondBold = {innertext: 'unchanged second'};
            const firstSpan = {setAttribute: sinon.spy(), innerText: 'unchanged first'};
            const secondSpan = {setAttribute: sinon.spy(), innerText: 'unchanged second'};

            const createParagraphMockCall = documentMock.expects('createElement').withArgs('p').returns(academicContainer).twice();
            createParagraphMockCall.onCall(0).returns(firstParagraph);
            createParagraphMockCall.onCall(1).returns(secondParagraph);
            const createBoldMockCall = documentMock.expects('createElement').withArgs('b').returns(academicContainer).twice();
            createBoldMockCall.onCall(0).returns(firstBold);
            createBoldMockCall.onCall(1).returns(secondBold);
            const createSpanMockCall = documentMock.expects('createElement').withArgs('span').returns(academicContainer).twice();
            createSpanMockCall.onCall(0).returns(firstSpan);
            createSpanMockCall.onCall(1).returns(secondSpan);
            getDocumentStub.returns(document);

            //action
            academicManager.renderAcademic(resumeData);
            //assert
            assert.equal(academicContainer.appendChild.calledTwice, true);
            documentMock.verify();
            assert.deepEqual(title.innerText, 'academic title');
            assert.deepEqual(firstSpan.innerText, '1st item - 2016');
            assert.deepEqual(secondSpan.innerText, '3rd item - 2016');

            assert.equal(firstParagraph.appendChild.calledTwice, true);
            assert.equal(secondParagraph.appendChild.calledTwice, true);

            assert.equal(academicContainer.appendChild.calledTwice, true);
        });

        it('should not try to render the academic section if there is no academic data', () => {
            //setup
            const document = {
                getElementById: () => {
                    throw new Error('mock not set up')
                }
            };
            const academicTitle = {innerText: 'title'};
            const academicContainer = {innerHTML: 'container'};
            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withArgs('academic').once().returns(academicContainer);
            documentMock.expects('getElementById').withArgs('academicTitle').once().returns(academicTitle);
            getDocumentStub.returns(document);

            //action
            academicManager.renderAcademic({});

            //assert
            assert.equal(academicTitle.innerText, '');
            assert.equal(academicContainer.innerHTML, '');
            documentMock.verify();
        });
    });

    it('should not display `- <year>` if not provided', () => {
        // setup
        const document = {
            getElementById: () => {
                throw new Error('mock not set up')
            }, createElement: () => {
                throw new Error('mock not set up')
            }
        };
        const title = {innerText: ''};
        const documentMock = sinon.mock(document);

        const academicContainer = {appendChild: sinon.spy()};

        documentMock.expects('getElementById').withArgs('academic').returns(academicContainer);
        documentMock.expects('getElementById').withArgs('academicTitle').returns(title);

        const firstParagraph = {appendChild: sinon.spy()};
        const firstBold = {innertext: 'unchanged first'};
        const firstSpan = {setAttribute: sinon.spy(), innerText: 'unchanged first'};

        const createParagraphMockCall = documentMock.expects('createElement').withArgs('p').returns(academicContainer).twice();
        createParagraphMockCall.onCall(0).returns(firstParagraph);
        const createBoldMockCall = documentMock.expects('createElement').withArgs('b').returns(academicContainer).twice();
        createBoldMockCall.onCall(0).returns(firstBold);
        const createSpanMockCall = documentMock.expects('createElement').withArgs('span').returns(academicContainer).twice();
        createSpanMockCall.onCall(0).returns(firstSpan);
        getDocumentStub.returns(document);

        // action
        academicManager.renderAcademic({
            academic: [{
                show: true, first: 'item',
                description: '1st item'
            }]
        });

        // assert
        assert.deepEqual(firstSpan.innerText, '1st item');
    });
});