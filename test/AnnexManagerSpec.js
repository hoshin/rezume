import {assert} from 'chai'
import AnnexManager from '../js/AnnexManager';
import sinon from 'sinon';
import utils from '../js/utils'

describe('AnnexManager', () => {
    let annexManager;
    let getDocumentStub;
    beforeEach(() => {
        annexManager = new AnnexManager(() => {
        }, () => {
        });
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
        utils.getDocument.restore()
    });

    describe('renderAnnexBigSection', () => {
        it('should set the foobar section title text to the value in resumeData.annex.foobar.title', () => {
            //setup
            const resumeData = {annex: {foobar: {title: 'foo'}}};
            const document = {
                getElementById: () => {
                    throw new Error('mock not set up')
                }
            };
            const getElementByIdMock = sinon.mock(document);
            const foobarTitleElement = {innerText: 'notFoo'};

            getElementByIdMock.expects('getElementById').withArgs('foobarList').once().returns(null);

            getElementByIdMock.expects('getElementById').withArgs('foobarTitle').once().returns(foobarTitleElement);
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnexBigSection(resumeData, 'foobar');
            //assert
            assert.equal(foobarTitleElement.innerText, 'foo');
            getElementByIdMock.verify();
        });

        it('should call appendItemsToDOMList with the correct section of the resumedata', () => {
            //setup
            const document = {
                getElementById: () => {
                    return {some: 'element'}
                }, createElement: () => {
                }
            };
            const appendItemsToDOMListStub = sinon.stub(annexManager, 'appendItemsToDOMList').returns();

            const resumeData = {annex: {baz: {list: ['not the right list']}, foobar: {list: ['foobar item']}}};
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnexBigSection(resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], {
                innerHTML: '',
                some: 'element'
            }]);
        });
    });

    describe('renderAnnexSkillsSection', () => {
        it('should set the foobar skill section title text to the value in resumeData.annex.skills.foobar.title', () => {
            //setup
            const resumeData = {annex: {skills: {foobar: {title: 'foo'}}}};
            const document = {
                getElementById: () => {
                    throw new Error('mock not set up')
                }
            };
            const getElementByIdMock = sinon.mock(document);
            const foobarTitleElement = {innerText: 'notFoo'};

            getElementByIdMock.expects('getElementById').withArgs('foobarSkillsList').once().returns(null);

            getElementByIdMock.expects('getElementById').withArgs('foobarSkillsTitle').once().returns(foobarTitleElement);
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnexSkillsSection(resumeData, 'foobar');
            //assert
            assert.equal(foobarTitleElement.innerText, 'foo');
            getElementByIdMock.verify();
        });

        it('should call appendItemsToDOMList with the correct section of the resumedata', () => {
            //setup
            const document = {
                getElementById: () => {
                    return {some: 'element'}
                }, createElement: () => {
                }
            };
            const appendItemsToDOMListStub = sinon.stub(annexManager, 'appendItemsToDOMList').returns();

            const resumeData = {
                annex: {
                    skills: {
                        baz: {list: ['not the right list']},
                        foobar: {list: ['foobar item']}
                    }
                }
            };
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnexSkillsSection(resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], {
                innerHTML: '',
                some: 'element'
            }]);
        });
    });

    describe('renderAnnex', () => {
        it('should trigger the rendering of all annex sections', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);

            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns({});
            documentMock.expects('getElementById').withExactArgs('skillsTitle').once().returns({});

            annexManager.renderAnnexBigSection = sinon.spy();
            annexManager.renderAnnexSkillsSection = sinon.spy();
            getDocumentStub.returns(document);
            //action
            annexManager.renderAnnex({annex: {title:'foo', skills: {}, publications: {}, misc: {}}});
            //assert
            assert.equal(annexManager.renderAnnexBigSection.calledTwice, true);
            assert.equal(annexManager.renderAnnexBigSection.getCall(0).args[1], ['publications']);
            assert.equal(annexManager.renderAnnexBigSection.getCall(1).args[1], ['misc']);

            assert.equal(annexManager.renderAnnexSkillsSection.callCount, 4);
            assert.equal(annexManager.renderAnnexSkillsSection.getCall(0).args[1], ['tech']);
            assert.equal(annexManager.renderAnnexSkillsSection.getCall(1).args[1], ['architecture']);
            assert.equal(annexManager.renderAnnexSkillsSection.getCall(2).args[1], ['methodologies']);
            assert.equal(annexManager.renderAnnexSkillsSection.getCall(3).args[1], ['other']);
        });

        it('should not try to set the annex title if it is not defined (and not render anything in the annex if it is the case)', () => {
            // setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {innerText: 'title'}, annexSkillsTitle = {innerText: 'title2'};
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);
            documentMock.expects('getElementById').withExactArgs('skillsTitle').once().returns(annexSkillsTitle);
            getDocumentStub.returns(document);
            const skillsSectionStub = sinon.stub(annexManager, 'renderAnnexSkillsSection');
            const bigSectionStub = sinon.stub(annexManager, 'renderAnnexBigSection');

            // action
            annexManager.renderAnnex({annex: {}});
            // assert
            documentMock.verify();
            assert.equal(annexTitle.innerText, '');
            assert.equal(annexSkillsTitle.innerText, '');
            assert.equal(skillsSectionStub.called, false);
            assert.equal(bigSectionStub.called, false);
        });

        it('should set annex titles of the section based on resumeData contents', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {}, annexSkillsTitle = {};
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);
            documentMock.expects('getElementById').withExactArgs('skillsTitle').once().returns(annexSkillsTitle);

            annexManager.renderAnnexBigSection = sinon.spy();
            annexManager.renderAnnexSkillsSection = sinon.spy();
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnex({annex: {skills: {title: 'annex skills title'}, title: 'annex title'}});
            //assert
            assert.equal(annexTitle.innerText, 'annex title');
            assert.equal(annexSkillsTitle.innerText, 'annex skills title');
        });

        it('should not render annex section if annex property is not set', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {innerText: 'title'}, annexSkillsTitle = {innerText: 'title 2'};
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);
            documentMock.expects('getElementById').withExactArgs('skillsTitle').once().returns(annexSkillsTitle);

            annexManager.renderAnnexBigSection = sinon.spy();
            annexManager.renderAnnexSkillsSection = sinon.spy();
            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnex({});
            //assert
            documentMock.verify();
            assert.equal(annexTitle.innerText, '');
            assert.equal(annexSkillsTitle.innerText, '');
        });

        it('should not render skills section of annex if annex property has no skills listed', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {innerText: 'title'};
            sinon.stub(annexManager, 'renderAnnexSkillsSection');
            sinon.stub(annexManager, 'renderAnnexBigSection');
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);

            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnex({annex: {title:'foo'}});
            //assert
            documentMock.verify();
            assert.equal(annexManager.renderAnnexSkillsSection.called, false);
        });

        it('should not render publications section of annex if annex property has no publications listed', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {innerText: 'title'};
            sinon.stub(annexManager, 'renderAnnexSkillsSection');
            const renderBigSectionStub = sinon.stub(annexManager, 'renderAnnexBigSection');
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);

            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnex({annex: {title:'foo', misc: {}}});
            //assert
            documentMock.verify();
            assert.equal(renderBigSectionStub.calledOnce, true);
            assert.deepEqual(renderBigSectionStub.getCall(0).args, [{annex: {title:'foo', misc: {}}}, 'misc']);
        });

        it('should not render misc section of annex if annex property has no misc listed', () => {
            //setup
            const document = {
                getElementById: () => {
                    return null;
                }
            };
            const documentMock = sinon.mock(document);
            const annexTitle = {innerText: 'title'};
            const renderBigSectionStub = sinon.stub(annexManager, 'renderAnnexBigSection');
            sinon.stub(annexManager, 'renderAnnexSkillsSection');
            documentMock.expects('getElementById').withExactArgs('annexTitle').once().returns(annexTitle);

            getDocumentStub.returns(document);

            //action
            annexManager.renderAnnex({annex: {title:'foo', publications: {}}});
            //assert
            documentMock.verify();
            assert.equal(renderBigSectionStub.calledOnce, true);
            assert.deepEqual(renderBigSectionStub.getCall(0).args, [{annex: {title:'foo', publications: {}}}, 'publications']);
        });
    });

    describe('appendItemsToDOMList', () => {
        it('should create a li element and append it to the foobarList if resumedata contains 1 foobar item', () => {
            //setup
            const foobarItem = {foobar: 'item', innerHTML: ''};
            const appendChildSpy = sinon.spy();
            const foobarList = {
                appendChild: appendChildSpy
            };

            const document = {
                createElement: () => {
                }
            };
            const documentMock = sinon.mock(document);
            documentMock.expects('createElement').withArgs('li').once().returns(foobarItem);
            getDocumentStub.returns(document);

            //action
            annexManager.appendItemsToDOMList(['foobar item'], foobarList);
            //assert
            documentMock.verify();
            assert.equal(foobarItem.innerHTML, 'foobar item');
            assert.equal(appendChildSpy.calledOnce, true);
            assert.deepEqual(appendChildSpy.getCall(0).args, [foobarItem]);
        });

        it('should create a li element and append it to the foobarList if resumedata contains 2 foobar items', () => {
            //setup
            const foobarItem = {foobar: 'item', innerHTML: ''};
            const anotherItem = {another: 'item', innerHTML: ''};
            const appendChildSpy = sinon.spy();
            const foobarList = {
                appendChild: appendChildSpy
            };

            const document = {
                createElement: () => {
                }
            };
            const documentMock = sinon.mock(document);

            const createElementCallMocks = documentMock.expects('createElement').withArgs('li').twice();
            createElementCallMocks.onCall(0).returns(foobarItem);
            createElementCallMocks.onCall(1).returns(anotherItem);
            getDocumentStub.returns(document);

            //action
            annexManager.appendItemsToDOMList(['foobar item', 'another item'], foobarList);
            //assert
            documentMock.verify();
            assert.equal(foobarItem.innerHTML, 'foobar item');
            assert.equal(anotherItem.innerHTML, 'another item');
            assert.equal(appendChildSpy.calledTwice, true);
            assert.deepEqual(appendChildSpy.getCall(0).args, [foobarItem]);
            assert.deepEqual(appendChildSpy.getCall(1).args, [anotherItem]);

        });
    });
});
