import {assert} from 'chai'
import {Rezume} from '../js/rezume';
import sinon from 'sinon';

describe('rezume', () => {
    let rezume;
    beforeEach(() => {
        rezume = new Rezume({}, {}, {});
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.appendItemsToDOMList(['foobar item'], foobarList);
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.appendItemsToDOMList(['foobar item', 'another item'], foobarList);
            //assert
            documentMock.verify();
            assert.equal(foobarItem.innerHTML, 'foobar item');
            assert.equal(anotherItem.innerHTML, 'another item');
            assert.equal(appendChildSpy.calledTwice, true);
            assert.deepEqual(appendChildSpy.getCall(0).args, [foobarItem]);
            assert.deepEqual(appendChildSpy.getCall(1).args, [anotherItem]);

        });
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnexBigSection(resumeData, 'foobar');
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
            const appendItemsToDOMListStub = sinon.stub(rezume, 'appendItemsToDOMList').returns();

            const resumeData = {annex: {baz: {list: ['not the right list']}, foobar: {list: ['foobar item']}}};
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnexBigSection(resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], document, {
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnexSkillsSection(resumeData, 'foobar');
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
            const appendItemsToDOMListStub = sinon.stub(rezume, 'appendItemsToDOMList').returns();

            const resumeData = {
                annex: {
                    skills: {
                        baz: {list: ['not the right list']},
                        foobar: {list: ['foobar item']}
                    }
                }
            };
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnexSkillsSection(resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], document, {
                innerHTML: '',
                some: 'element'
            }]);
        });
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAcademic(resumeData);
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAcademic(resumeData);
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAcademic({});

            //assert
            assert.equal(academicTitle.innerText, '');
            assert.equal(academicContainer.innerHTML, '');
            documentMock.verify();
        });
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAbout(aboutData);
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAbout();
            //assert
            assert.equal(aboutTitle.innerText, '');
            assert.equal(aboutContents.innerHTML, '');
            documentMock.verify();
        });
    });

    describe('hideUnspecifiedHeaders', () => {
        let headersList;

        beforeEach(() => {
            headersList = ['twitter', 'github', 'email', 'name', 'position', 'addressLine1', 'addressLine2', 'phone', 'picture']
        });

        const testCases = ['twitter', 'github', 'email', 'name', 'position', 'addressLine1', 'addressLine2', 'phone', 'picture'];

        testCases.forEach((missingHeader) => {
            it(`should not display the ${missingHeader} section if no such property is present in headers data`, () => {
                //setup
                rezume.expectedHeaders = [].concat(headersList);
                const document = {
                    getElementById: () => {
                    }
                };
                const documentMock = sinon.mock(document);
                const headerElement = {
                    setAttribute: () => {
                    }
                };

                headersList = headersList.filter((headerItem) => {
                    return headerItem !== missingHeader;
                });

                sinon.stub(headerElement, 'setAttribute').returns();

                documentMock.expects('getElementById').withExactArgs(`${missingHeader}Container`).never();
                documentMock.expects('getElementById').exactly(8).returns(headerElement);

                //action
                rezume.hideUnspecifiedHeaders(headersList, document);
                //assert
                documentMock.verify();
                assert.deepEqual(headerElement.setAttribute.getCall(0).args, ['style', 'display:block']);
            });
        });
    });

    describe('renderHeader', () => {
        it('should set the src attribute to the picture element if resumeData.header has a "picture" property', () => {
            //setup
            const resumeData = {header: {picture: 'picture-reference'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const setAttributeSpy = sinon.spy();
            const pictureElement = {setAttribute: setAttributeSpy};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withArgs('picture').returns(pictureElement);
            documentMock.expects('getElementById').withArgs('picture-reference').returns({
                getAttribute: () => {
                    return 'picture-src';
                }
            });
            sinon.stub(rezume, 'hideUnspecifiedHeaders');
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(setAttributeSpy.calledOnce, true);
            assert.equal(setAttributeSpy.calledWithExactly('src', 'picture-src'), true);
            documentMock.verify();
        });

        it('should set the "twitter" innerText and href if resumeData.header has a "twitter" attribute', () => {
            //setup
            const resumeData = {header: {twitter: 'foo'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const setAttributeSpy = sinon.spy();
            const twitterElement = {setAttribute: setAttributeSpy};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withExactArgs('twitter').returns(twitterElement);
            sinon.stub(rezume, 'hideUnspecifiedHeaders');
            sinon.stub(rezume, 'getDocument').returns(document);


            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(setAttributeSpy.calledWithExactly('href', 'https://twitter.com/foo'), true);
            assert.equal(twitterElement.innerText, '@foo');
        });

        it('should set the "github" innerText and href if resumeData.header has a "github" attribute', () => {
            //setup
            const resumeData = {header: {github: 'foo'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const setAttributeSpy = sinon.spy();
            const githubElement = {setAttribute: setAttributeSpy};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withExactArgs('github').returns(githubElement);
            sinon.stub(rezume, 'hideUnspecifiedHeaders');
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(setAttributeSpy.calledWithExactly('href', 'https://github.com/foo'), true);
            assert.equal(githubElement.innerText, 'https://github.com/foo');
        });

        it('should set the email link if resumeData.header has an "email" attribute', () => {
            //setup
            const resumeData = {header: {email: 'mail@foo.bar'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const setAttributeSpy = sinon.spy();
            const emailElement = {setAttribute: setAttributeSpy};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withExactArgs('email').returns(emailElement);
            sinon.stub(rezume, 'hideUnspecifiedHeaders');
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(setAttributeSpy.calledWithExactly('href', 'mailto:mail@foo.bar'), true);
            assert.equal(emailElement.innerText, 'mail@foo.bar');
        });

        it('should set any random element innerText to the value in the designated header property', () => {
            //setup
            const resumeData = {header: {random: 'some random data'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const randomElement = {};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withExactArgs('random').returns(randomElement);
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(randomElement.innerHTML, 'some random data');
        });

        it('should accept multiple header properties', () => {
            //setup
            const resumeData = {header: {random: 'some random data', moreRandom: 'another property'}};
            const document = {
                getElementById: () => {
                    return {foo: 'bar'};
                }
            };
            const randomElement = {};
            const moreRandomElement = {};

            const documentMock = sinon.mock(document);
            documentMock.expects('getElementById').withExactArgs('random').returns(randomElement);
            documentMock.expects('getElementById').withExactArgs('moreRandom').returns(moreRandomElement);
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader(resumeData);
            //assert
            assert.equal(randomElement.innerHTML, 'some random data');
            assert.equal(moreRandomElement.innerHTML, 'another property');
        });

        it('should not render header if no header data is present', () => {
            //setup
            const getElementSpy = sinon.spy();
            const document = {
                getElementById: getElementSpy
            };
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderHeader({});
            //assert
            assert.equal(getElementSpy.callCount, 0);
        });
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
            rezume.appendAssignmentToList = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAssignments(resumeData, {}, 'relevant');
            //assert
            assert.equal(title.innerText, 'new title');
            assert.equal(comment.innerText, 'new comment');
            documentMock.verify();
        });

        it('should correctly call the appendAssignment method if 1 assignment is present', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            rezume = new Rezume({}, {}, {assignment1: {some: 'data'}});
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
            rezume.appendAssignmentToList = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAssignments(resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.deepEqual(rezume.appendAssignmentToList.getCall(0).args, [document, {some: 'data'}, undefined, {innerHTML: ''}]);
        });

        it('should append 2 elements to the assignments list if configured assignments list has 2 elements', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            rezume = new Rezume({}, {}, {
                assignment1: {some: 'data'},
                assignment3: {some: 'other data'},
                assignment2: {some: 'data again'}
            });
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
            rezume.appendAssignmentToList = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAssignments(resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.equal(rezume.appendAssignmentToList.calledTwice, true);
            assert.deepEqual(rezume.appendAssignmentToList.getCall(0).args, [document, {some: 'data'}, undefined, {innerHTML: ''}]);
            assert.deepEqual(rezume.appendAssignmentToList.getCall(1).args, [document, {some: 'data again'}, undefined, {innerHTML: ''}]);
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
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAssignments({}, {}, 'relevant');
            //assert
            documentMock.verify();
            assert.equal(title.innerText, '');
            assert.equal(comment.innerText, '');
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

            rezume.renderAnnexBigSection = sinon.spy();
            rezume.renderAnnexSkillsSection = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);
            //action
            rezume.renderAnnex({annex: {skills: {}}});
            //assert
            assert.equal(rezume.renderAnnexBigSection.calledTwice, true);
            assert.equal(rezume.renderAnnexBigSection.getCall(0).args[1], ['publications']);
            assert.equal(rezume.renderAnnexBigSection.getCall(1).args[1], ['misc']);

            assert.equal(rezume.renderAnnexSkillsSection.callCount, 4);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(0).args[1], ['tech']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(1).args[1], ['architecture']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(2).args[1], ['methodologies']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(3).args[1], ['other']);
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

            rezume.renderAnnexBigSection = sinon.spy();
            rezume.renderAnnexSkillsSection = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnex({annex: {skills: {title: 'annex skills title'}, title: 'annex title'}});
            //assert
            assert.equal(annexTitle.innerText, 'annex title');
            assert.equal(annexSkillsTitle.innerText, 'annex skills title');
        });

        it('should not render annex section if noting to render', () => {
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

            rezume.renderAnnexBigSection = sinon.spy();
            rezume.renderAnnexSkillsSection = sinon.spy();
            sinon.stub(rezume, 'getDocument').returns(document);

            //action
            rezume.renderAnnex({});
            //assert
            documentMock.verify();
            assert.equal(annexTitle.innerText, '');
            assert.equal(annexSkillsTitle.innerText, '');
        });
    });

    describe('render', () => {
        beforeEach(() => {
           sinon.stub(rezume, 'getDocument');
        });

        afterEach(() => {
            rezume.getDocument.restore();
        });

        it('should not render the "other assignments section" by default', () => {
            //setup
            rezume.renderHeader = sinon.spy();
            rezume.renderAbout = sinon.spy();
            rezume.renderAcademic = sinon.spy();
            rezume.renderAssignments = sinon.spy();
            rezume.renderAnnex = sinon.spy();
            rezume.resumeData = {header: {}};
            rezume.options = {};
            rezume.hideUnspecifiedHeaders = sinon.stub();
            rezume.getDocument.returns({});

            //action
            rezume.render();
            //assert
            assert.equal(rezume.renderAssignments.calledOnce, true);
            assert.equal(rezume.renderAssignments.getCall(0).args[2], 'relevant');
            assert.equal(rezume.renderHeader.calledOnce, true);
            assert.equal(rezume.renderAbout.calledOnce, true);
            assert.equal(rezume.renderAcademic.calledOnce, true);
            assert.equal(rezume.renderAnnex.calledOnce, true);
        });

        it('should render the "other assignments section" if resumeOptions specify it', () => {
            //setup
            rezume.renderHeader = sinon.spy();
            rezume.renderAbout = sinon.spy();
            rezume.renderAcademic = sinon.spy();
            rezume.renderAssignments = sinon.spy();
            rezume.renderAnnex = sinon.spy();
            rezume.resumeData = {header: {}};
            rezume.options = {showOtherAssignments: true};
            rezume.hideUnspecifiedHeaders = sinon.stub();

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
            rezume.getDocument.returns(document);

            //action
            rezume.render();
            //assert
            assert.equal(rezume.renderAssignments.calledTwice, true);
            assert.equal(rezume.renderAssignments.getCall(1).args[3], 'other');
            assert.equal(otherAssignmentsList.setAttribute.calledOnce, true);
            assert.equal(otherAssignmentsList.setAttribute.calledWithExactly('style', 'display:block'), true);
            assert.equal(otherAssignments.setAttribute.calledOnce, true);
            assert.equal(otherAssignments.setAttribute.calledWithExactly('style', 'display:block'), true);
        });

        it('should set global document title', () => {
            //setup
            rezume.renderHeader = sinon.spy();
            rezume.renderAbout = sinon.spy();
            rezume.renderAcademic = sinon.spy();
            rezume.renderAssignments = sinon.spy();
            rezume.renderAnnex = sinon.spy();
            rezume.resumeData = {title: 'foobar', header: {}};
            rezume.hideUnspecifiedHeaders = sinon.stub();
            const document = {title: 'baz'};
            rezume.options = {};
            rezume.getDocument.returns(document);

            //action
            rezume.render();
            //assert
            assert.equal(document.title, 'foobar');
        });
    });

    describe('createAssignmentLogoFrame', () => {
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
            documentMock.expects('getElementById').withExactArgs('foo').returns({
                getAttribute: () => {
                    return 'assignment logo src'
                }
            });
            documentMock.expects('createElement').withExactArgs('p').returns(assignmentDuration);
            //action
            rezume.createAssignmentLogoFrame(document, {logo: 'foo', logoAlt: 'bar', duration: 'baz'});
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
            documentMock.expects('getElementById').withExactArgs('foo').returns(null);
            documentMock.expects('createElement').withExactArgs('p').returns(assignmentDuration);
            //action
            rezume.createAssignmentLogoFrame(document, {logo: 'foo', logoAlt: 'bar', duration: 'baz'});
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

            //action
            rezume.createAssignmentDescription(document, assignment);
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

            //action
            rezume.createAssignmentDescription(document, assignment, true);
            //assert
            assert.equal(assignmentDescription.appendChild.calledThrice, true);
            assert.deepEqual(assignmentDescription.appendChild.getCall(2).args, [keywords]);
            assert.deepEqual(keywords.setAttribute.getCall(0).args, ['class', 'mission-keywords']);
            assert.equal(keywords.innerText, 'foo bar baz');
            documentMock.verify();
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
            rezume.createAssignmentDescription = sinon.spy();
            rezume.createAssignmentLogoFrame = sinon.spy();
            const assignment = {assignment: 'data'};

            //action
            rezume.appendAssignmentToList(document, assignment, false, topLevelContainer);
            //assert
            assert.equal(rezume.createAssignmentDescription.calledOnce, true);
            assert.equal(rezume.createAssignmentLogoFrame.calledOnce, true);
            assert.equal(assignmentContainer.setAttribute.calledOnce, true);
            assert.deepEqual(assignmentContainer.setAttribute.getCall(0).args, ['class', 'mission']);
            assert.equal(topLevelContainer.appendChild.calledOnce, true);
            assert.deepEqual(topLevelContainer.appendChild.getCall(0).args, [assignmentContainer]);

            assert.deepEqual(rezume.createAssignmentDescription.calledOnce, true);
            assert.deepEqual(rezume.createAssignmentLogoFrame.calledOnce, true);
            assert.deepEqual(rezume.createAssignmentDescription.getCall(0).args, [document, assignment, false]);
            assert.deepEqual(rezume.createAssignmentLogoFrame.getCall(0).args, [document, assignment]);
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

        it('should set the default values for resume header if none are set by the configuration', () => {
            //setup
            //action
            const resume = new Rezume({}, {}, {});
            //assert
            assert.deepEqual(resume.expectedHeaders, ['twitter', 'github', 'email', 'name', 'addressLine1', 'addressLine2', 'position', 'phone', 'picture']);
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
            assert.deepEqual(resume.expectedHeaders, [1, 2, 3, 4]);
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
            assert.deepEqual(resume.expectedHeaders, [1, 2, 3, 4]);
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
            sinon.stub(resume, 'getDocument').returns({getElementById: getElementByIdStub});
            resume.selectorChange();
            getElementByIdStub.returns({value: 1});
            //action
            resume.selectorChange();
            //assert
            assert.deepEqual(resume.resumeData, {foo: 'bat', bar: false, random: 42});
        });
    });

    describe('lookupPicture', () => {
        it('should return the location passed as parameter if it is a URL', () => {
            //setup / action
            const actual = rezume.lookupPicture('http://foo.bar');
            //assert
            assert.equal(actual, 'http://foo.bar');
        });

        it('should lookup the embedded resource in the document if location is not a URL', () => {
            //setup
            const document = {
                getElementById: () => {
                }
            };
            const documentMock = sinon.mock(document);
            const picture = {
                getAttribute: () => {
                }
            };
            const pictureMock = sinon.mock(picture);

            documentMock.expects('getElementById').withExactArgs('foo').once().returns(picture);
            pictureMock.expects('getAttribute').withExactArgs('src').once().returns('some embedded picture data');
            //action
            const actual = rezume.lookupPicture('foo', document);
            //assert
            assert.equal(actual, 'some embedded picture data');
            documentMock.verify();
            pictureMock.verify();
        });

        it('should return an empty string if logo cannot be found', () => {
            //setup
            const document = {
                getElementById: () => {
                }
            };
            const documentMock = sinon.mock(document);

            documentMock.expects('getElementById').withExactArgs('foo').once().returns(null);
            //action
            const actual = rezume.lookupPicture('foo', document);
            //assert
            assert.equal(actual, '');
            documentMock.verify();
        });
    });
});
