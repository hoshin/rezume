import {assert} from 'chai'
import AssignmentsManager from '../js/AssignmentsManager';
import sinon from 'sinon';
import utils from '../js/utils'

describe('AssignmentsManager', () => {
    let assignmentsManager;
    let getDocumentStub;
    beforeEach(() => {
        assignmentsManager = new AssignmentsManager({});
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
        utils.getDocument.restore();
    });

    describe('renderAssignments', () => {
        it('should set the title and comments of the relevant assignments section', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            const resumeData = {relevantAssignments: {title: 'new title', comment: 'new comment', list: []}};
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);

            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsTitle').once().returns(title);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsComment').once().returns(comment);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsList').once().returns({});
            assignmentsManager.appendAssignmentToList = sinon.spy();
            getDocumentStub.returns(document);

            //action
            assignmentsManager.renderAssignments(resumeData, {}, 'relevant');
            //assert
            assert.equal(title.innerText, 'new title');
            assert.equal(comment.innerText, 'new comment');
            documentMock.verify();
        });

        it('should correctly call the appendAssignment method if 1 assignment is present', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            assignmentsManager = new AssignmentsManager({assignment1: {some: 'data'}}, () => {}, () => {});
            const resumeData = {
                relevantAssignments: {
                    title: 'new title', comment: 'new comment', list: ['assignment1']
                }
            };
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);

            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsTitle').once().returns(title);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsComment').once().returns(comment);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsList').once().returns({});
            assignmentsManager.appendAssignmentToList = sinon.spy();
            getDocumentStub.returns(document);

            //action
            assignmentsManager.renderAssignments(resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.deepEqual(assignmentsManager.appendAssignmentToList.getCall(0).args, [{some: 'data'}, undefined, {innerHTML: ''}]);
        });

        it('should append 2 elements to the assignments list if configured assignments list has 2 elements', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            assignmentsManager = new AssignmentsManager({
                assignment1: {some: 'data'},
                assignment3: {some: 'other data'},
                assignment2: {some: 'data again'}
            }, () => {}, () => {});
            const resumeData = {
                relevantAssignments: {
                    title: 'new title', comment: 'new comment', list: ['assignment1', 'assignment2']
                }
            };
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);

            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsTitle').once().returns(title);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsComment').once().returns(comment);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsList').once().returns({});
            assignmentsManager.appendAssignmentToList = sinon.spy();
            getDocumentStub.returns(document);

            //action
            assignmentsManager.renderAssignments(resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.equal(assignmentsManager.appendAssignmentToList.calledTwice, true);
            assert.deepEqual(assignmentsManager.appendAssignmentToList.getCall(0).args, [{some: 'data'}, undefined, {innerHTML: ''}]);
            assert.deepEqual(assignmentsManager.appendAssignmentToList.getCall(1).args, [{some: 'data again'}, undefined, {innerHTML: ''}]);
        });

        it('should not render assignments section if nothing relevant to render', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const title = {innerText: 'title'};
            const comment = {innerText: 'comment'}

            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsTitle').once().returns(title);
            documentMock.expects('getElementById').withExactArgs('relevantAssignmentsComment').once().returns(comment);
            getDocumentStub.returns(document);

            //action
            assignmentsManager.renderAssignments({}, {}, 'relevant');
            //assert
            documentMock.verify();
            assert.equal(title.innerText, '');
            assert.equal(comment.innerText, '');
        });
    });

    describe('appendAssignmentToList', () => {
        it('should create logo and description sections, append them to a top container and append it to the argument container', () => {
            //setup
            const topLevelContainer = {appendChild: sinon.spy()};
            const document = {
                createElement: () => {
                }
            };
            const documentMock = sinon.mock(document);
            const assignmentContainer = {appendChild: sinon.spy(), setAttribute: sinon.spy()};
            documentMock.expects('createElement').withExactArgs('div').returns(assignmentContainer);
            assignmentsManager.createAssignmentDescription = sinon.spy();
            assignmentsManager.createAssignmentLogoFrame = sinon.spy();
            const assignment = {assignment: 'data'};
            getDocumentStub.returns(document);

            //action
            assignmentsManager.appendAssignmentToList(assignment, false, topLevelContainer);
            //assert
            assert.equal(assignmentsManager.createAssignmentDescription.calledOnce, true);
            assert.equal(assignmentsManager.createAssignmentLogoFrame.calledOnce, true);
            assert.equal(assignmentContainer.setAttribute.calledOnce, true);
            assert.deepEqual(assignmentContainer.setAttribute.getCall(0).args, ['class', 'mission']);
            assert.equal(topLevelContainer.appendChild.calledOnce, true);
            assert.deepEqual(topLevelContainer.appendChild.getCall(0).args, [assignmentContainer]);

            assert.deepEqual(assignmentsManager.createAssignmentDescription.calledOnce, true);
            assert.deepEqual(assignmentsManager.createAssignmentLogoFrame.calledOnce, true);
            assert.deepEqual(assignmentsManager.createAssignmentDescription.getCall(0).args, [assignment, false]);
            assert.deepEqual(assignmentsManager.createAssignmentLogoFrame.getCall(0).args, [assignment]);
        });
    });

    describe('createAssignmentLogoFrame', () => {
        let lookupPictureStub;
        beforeEach(() => {
            lookupPictureStub = sinon.stub(utils, 'lookupPicture')
        });

        afterEach(() => {
            utils.lookupPicture.restore()
        });

        it('should create an element where logo and time data are inserted', () => {
            //setup
            const document = {
                getElementById: () => {
                    return {};
                },
                createElement: function () {
                    return {};
                }
            };
            const documentMock = sinon.mock(document);
            const assignmentLogoTime = {setAttribute: sinon.spy(), appendChild: sinon.spy()};
            const assignmentImage = {setAttribute: sinon.spy()};
            const assignmentDuration = {innerText: 'needs to be modified'};

            documentMock.expects('createElement').withExactArgs('div').returns(assignmentLogoTime);
            documentMock.expects('createElement').withExactArgs('img').returns(assignmentImage);

            documentMock.expects('createElement').withExactArgs('p').returns(assignmentDuration);
            getDocumentStub.returns(document);
            lookupPictureStub.returns('assignment logo src');
            //action
            assignmentsManager.createAssignmentLogoFrame({logo: 'foo', logoAlt: 'bar', duration: 'baz'});
            //assert
            assert.deepEqual(assignmentLogoTime.setAttribute.calledOnce, true);
            assert.deepEqual(assignmentLogoTime.setAttribute.getCall(0).args, ['class', 'mission-logo-time']);
            assert.deepEqual(assignmentLogoTime.appendChild.calledTwice, true);
            assert.deepEqual(assignmentLogoTime.appendChild.getCall(0).args, [assignmentImage]);
            assert.deepEqual(assignmentLogoTime.appendChild.getCall(1).args, [assignmentDuration]);
            assert.deepEqual(assignmentImage.setAttribute.calledTwice, true);
            assert.deepEqual(assignmentImage.setAttribute.getCall(0).args, ['src', 'assignment logo src']);
            assert.deepEqual(assignmentImage.setAttribute.getCall(1).args, ['alt', 'bar']);
            assert.deepEqual(assignmentDuration.innerText, 'baz');

            documentMock.verify();
        });

        it('should not try to get the image src if given ID does not match any DOM element', () => {
            //setup
            const document = {
                getElementById: () => {
                    return {};
                },
                createElement: function () {
                    return {};
                }
            };
            const documentMock = sinon.mock(document);
            const assignmentLogoTime = {setAttribute: sinon.spy(), appendChild: sinon.spy()};
            const assignmentImage = {setAttribute: sinon.spy()};
            const assignmentDuration = {innerText: 'needs to be modified'};

            documentMock.expects('createElement').withExactArgs('div').returns(assignmentLogoTime);
            documentMock.expects('createElement').withExactArgs('img').returns(assignmentImage);
            documentMock.expects('createElement').withExactArgs('p').returns(assignmentDuration);
            getDocumentStub.returns(document);
            lookupPictureStub.returns('');

            //action
            assignmentsManager.createAssignmentLogoFrame({logo: 'foo', logoAlt: 'bar', duration: 'baz'});
            //assert
            assert.deepEqual(assignmentImage.setAttribute.calledTwice, true);
            assert.deepEqual(assignmentImage.setAttribute.getCall(0).args, ['src', '']);
            assert.deepEqual(assignmentImage.setAttribute.getCall(1).args, ['alt', 'bar']);

            documentMock.verify();
        });
    });

    describe('createAssignmentDescription', () => {
        it('should create a title and paragraph for the description and set them to the values in the assignment object', () => {
            //setup
            const assignment = {title: 'title', shortDescription: 'short description'};
            const assignmentDescription = {setAttribute: sinon.spy(), appendChild: sinon.spy()};
            const document = {
                createElement: () => {
                }
            };
            const documentMock = sinon.mock(document);
            const descriptionTitle = {};
            const descriptionParagraph = {};
            documentMock.expects('createElement').withExactArgs('div').returns(assignmentDescription);
            documentMock.expects('createElement').withExactArgs('h2').returns(descriptionTitle);
            documentMock.expects('createElement').withExactArgs('p').returns(descriptionParagraph);
            getDocumentStub.returns(document);

            //action
            assignmentsManager.createAssignmentDescription(assignment);
            //assert
            assert.deepEqual(assignmentDescription.appendChild.calledTwice, true);
            assert.deepEqual(assignmentDescription.appendChild.getCall(0).args, [descriptionTitle]);
            assert.deepEqual(assignmentDescription.appendChild.getCall(1).args, [descriptionParagraph]);
            assert.deepEqual(assignmentDescription.setAttribute.getCall(0).args, ['class', 'mission-desc']);
            assert.deepEqual(descriptionTitle.innerText, 'title');
            assert.deepEqual(descriptionParagraph.innerHTML, 'short description');

            documentMock.verify();
        });

        it('should append keywords to the description block if "showKeywords" is true', () => {
            //setup
            const assignment = {title: 'title', shortDescription: 'short description', keywords: 'foo bar baz'};
            const assignmentDescription = {setAttribute: sinon.spy(), appendChild: sinon.spy()};
            const document = {
                createElement: () => {
                }
            };
            const documentMock = sinon.mock(document);
            const descriptionTitle = {};
            const descriptionParagraph = {};
            const keywords = {setAttribute: sinon.spy()};
            documentMock.expects('createElement').withExactArgs('div').returns(assignmentDescription);
            documentMock.expects('createElement').withExactArgs('h2').returns(descriptionTitle);
            const paragraphMock = documentMock.expects('createElement').withExactArgs('p').twice();
            paragraphMock.onCall(0).returns(descriptionParagraph);
            paragraphMock.onCall(1).returns(keywords);
            getDocumentStub.returns(document);

            //action
            assignmentsManager.createAssignmentDescription(assignment, true);
            //assert
            assert.equal(assignmentDescription.appendChild.calledThrice, true);
            assert.deepEqual(assignmentDescription.appendChild.getCall(2).args, [keywords]);
            assert.deepEqual(keywords.setAttribute.getCall(0).args, ['class', 'mission-keywords']);
            assert.equal(keywords.innerText, 'foo bar baz');
            documentMock.verify();
        });
    });
});
