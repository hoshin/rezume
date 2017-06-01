import {assert} from 'chai'
import {Rezume} from '../js/rezume';
import sinon from 'sinon';
import utils from '../js/utils';

describe('rezume', () => {
    let rezume;
    let getDocumentStub;
    beforeEach(() => {
        rezume = new Rezume({}, {}, {});
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
        utils.getDocument.restore();
    });

    describe('render', () => {

        beforeEach(() => {
            rezume.headersManager = {renderHeader: sinon.spy()};
            rezume.aboutManager = {renderAbout: sinon.spy()};
            rezume.academicManager = {renderAcademic: sinon.spy()};
            rezume.annexManager = {renderAnnex: sinon.spy()};
            rezume.assignmentsManager = {renderAssignments: sinon.spy()};
            rezume.resumeData = {header: {}};
            rezume.options = {};
            getDocumentStub.returns({});
        });

        it('should not render the "other assignments section" by default', () => {
            //setup
            //action
            rezume.render();
            //assert
            assert.equal(rezume.assignmentsManager.renderAssignments.calledOnce, true);
            assert.equal(rezume.assignmentsManager.renderAssignments.getCall(0).args[2], 'relevant');
            assert.equal(rezume.headersManager.renderHeader.calledOnce, true);
            assert.equal(rezume.aboutManager.renderAbout.calledOnce, true);
            assert.equal(rezume.academicManager.renderAcademic.calledOnce, true);
            assert.equal(rezume.annexManager.renderAnnex.calledOnce, true);
        });

        it('should render the "other assignments section" if resumeOptions specify it', () => {
            //setup
            rezume.options = {showOtherAssignments: true};
            const document = {
                getElementById: () => {
                    return {};
                }
            };
            const documentMock = sinon.mock(document);
            const otherAssignmentsList = {setAttribute: sinon.spy()};
            const otherAssignments = {setAttribute: sinon.spy()};
            documentMock.expects('getElementById').withExactArgs('otherAssignmentsList').returns(otherAssignmentsList);
            documentMock.expects('getElementById').withExactArgs('otherAssignments').returns(otherAssignments);
            getDocumentStub.returns(document);

            //action
            rezume.render();
            //assert
            assert.equal(rezume.assignmentsManager.renderAssignments.calledTwice, true);
            assert.equal(rezume.assignmentsManager.renderAssignments.getCall(1).args[2], 'other');
            assert.equal(otherAssignmentsList.setAttribute.calledOnce, true);
            assert.equal(otherAssignmentsList.setAttribute.calledWithExactly('style', 'display:block'), true);
            assert.equal(otherAssignments.setAttribute.calledOnce, true);
            assert.equal(otherAssignments.setAttribute.calledWithExactly('style', 'display:block'), true);
        });

        it('should set global document title', () => {
            //setup
            rezume.resumeData = {title: 'foobar', header: {}};
            const document = {title: 'baz'};
            rezume.options = {};
            getDocumentStub.returns(document);

            //action
            rezume.render();
            //assert
            assert.equal(document.title, 'foobar');
        });
    });

    describe('constructor', () => {
        let updateSpy;
        beforeEach(() => {
            updateSpy = sinon.spy(Rezume.prototype, 'updateCVSelector');
        });

        afterEach(() => {
            updateSpy.restore();
        });

        it('should complain if resume data is null or undefined', () => {
            //setup

            //action / assert
            try {
                new Rezume();
                assert.fail('Constructor should throw an error if given resumedata is not defined');
            } catch (err) {
                assert.equal(err.message, 'You need to specify some resume data for all this to make sense');
                assert.equal(true, true);
            }
        });

        it('should be able to handle an array of assignments (and setup to use the 1st one as default)', () => {
            //setup
            const assignments = [{name: 'resume 1', expectedHeaders: [1, 2, 3, 4]}, {name: 'resume 2'}];
            //action
            const resume = new Rezume({}, {}, assignments, null);
            //assert
            assert.equal(updateSpy.calledOnce, true);
            assert.deepEqual(resume.assignmentsList, [{
                name: 'resume 1',
                expectedHeaders: [1, 2, 3, 4]
            }, {name: 'resume 2'}]);
            assert.deepEqual(resume.assignments, {name: 'resume 1', expectedHeaders: [1, 2, 3, 4]});
            assert.deepEqual(resume.headersManager.expectedHeaders, [1, 2, 3, 4]);
            assert.deepEqual(updateSpy.getCall(0).args[0], [{
                name: 'resume 1',
                expectedHeaders: [1, 2, 3, 4]
            }, {name: 'resume 2'}]);
        });

        it('should treat a single assignments list as an array w/ 1 assignments list in it', () => {
            //setup
            const assignments = {name: 'resume 1', expectedHeaders: [1, 2, 3, 4]};
            //action
            const resume = new Rezume({}, {}, assignments, null);
            //assert
            assert.equal(updateSpy.calledOnce, true);
            assert.deepEqual(resume.assignmentsList, [{name: 'resume 1', expectedHeaders: [1, 2, 3, 4]}]);
            assert.deepEqual(resume.assignments, {name: 'resume 1', expectedHeaders: [1, 2, 3, 4]});
            assert.deepEqual(resume.headersManager.expectedHeaders, [1, 2, 3, 4]);
            assert.deepEqual(updateSpy.getCall(0).args[0], [{name: 'resume 1', expectedHeaders: [1, 2, 3, 4]}]);
        });

        it('should override the default resumeData if resumeData is set in displayed assignment', () => {
            //setup
            const assignments = {resumeData: {foo: 'baz', extra: 'field'}};
            //action
            const resume = new Rezume({}, {foo: 'bar', bar: false}, assignments, null);
            //assert
            assert.deepEqual(resume.resumeData, {foo: 'baz', bar: false, extra: 'field'});
        });

        it('should set _originalResumeData with initial resumeData without overrides', () => {
            //setup
            const assignments = {resumeData: {foo: 'baz', extra: 'field'}};
            //action
            const resume = new Rezume({}, {foo: 'bar', bar: false}, assignments, null);
            //assert
            assert.deepEqual(resume._originalResumeData, {foo: 'bar', bar: false});
        })
    });

    describe('selectorChange', () => {
        it('should update resumeData based on original values & new assignmentsList overrides', () => {
            //setup
            const assignments = [{resumeData: {foo: 'baz', extra: 'field'}}, {resumeData: {foo: 'bat', random: 42}}];
            const resume = new Rezume({}, {foo: 'bar', bar: false}, assignments, null);
            const getElementByIdStub = sinon.stub().returns({value: 0});
            getDocumentStub.returns({getElementById: getElementByIdStub});
            resume.annexManager = {renderAnnex: sinon.stub()};
            resume.assignmentsManager = {renderAssignments: sinon.stub(), updateAssignmentsData: sinon.stub()};
            resume.selectorChange();
            getElementByIdStub.returns({value: 1});
            //action
            resume.selectorChange();
            //assert
            assert.deepEqual(resume.resumeData, {foo: 'bat', bar: false, random: 42});
            assert.equal(resume.assignmentsManager.updateAssignmentsData.calledTwice, true);
            assert.deepEqual(resume.assignmentsManager.updateAssignmentsData.getCall(0).args[0], {
                "resumeData": {
                    "extra": "field",
                    "foo": "baz"
                }
            });
            assert.deepEqual(resume.assignmentsManager.updateAssignmentsData.getCall(1).args[0], {
                "resumeData": {
                    "foo": "bat",
                    "random": 42
                }
            });
        });
    });
});
