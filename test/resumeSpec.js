import {assert} from 'chai'
import {Rezume} from '../js/rezume';
import sinon from 'sinon';

describe('rezume', () => {
    let rezume;
    beforeEach(() => {
        rezume = new Rezume({}, {});
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

            //action
            rezume.appendItemsToDOMList(['foobar item'], document, foobarList);
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

            //action
            rezume.appendItemsToDOMList(['foobar item', 'another item'], document, foobarList);
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
            //action
            rezume.renderAnnexBigSection(document, resumeData, 'foobar');
            //assert
            assert.equal(foobarTitleElement.innerText, 'foo');
            getElementByIdMock.verify();
        });

        it('should call appendItemsToDOMList with the correct section of the resumedata', () => {
            //setup
            const document = {
                getElementById  : () => {
                    return {some: 'element'}
                }, createElement: () => {
                }
            };
            const appendItemsToDOMListStub = sinon.stub(rezume, 'appendItemsToDOMList').returns();

            const resumeData = {annex: {baz: {list: ['not the right list']}, foobar: {list: ['foobar item']}}};

            //action
            rezume.renderAnnexBigSection(document, resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], document, {some: 'element'}]);
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
            //action
            rezume.renderAnnexSkillsSection(document, resumeData, 'foobar');
            //assert
            assert.equal(foobarTitleElement.innerText, 'foo');
            getElementByIdMock.verify();
        });

        it('should call appendItemsToDOMList with the correct section of the resumedata', () => {
            //setup
            const document = {
                getElementById  : () => {
                    return {some: 'element'}
                }, createElement: () => {
                }
            };
            const appendItemsToDOMListStub = sinon.stub(rezume, 'appendItemsToDOMList').returns();

            const resumeData = {
                annex: {
                    skills: {
                        baz   : {list: ['not the right list']},
                        foobar: {list: ['foobar item']}
                    }
                }
            };

            //action
            rezume.renderAnnexSkillsSection(document, resumeData, 'foobar');
            //assert
            assert.equal(appendItemsToDOMListStub.calledOnce, true);
            assert.deepEqual(appendItemsToDOMListStub.getCall(0).args, [['foobar item'], document, {some: 'element'}]);
        });
    });

    describe('renderAcademic', () => {
        it('should not create any elements if none have a "show" flag', () => {
            //setup
            const document = {
                getElementById  : () => {
                    throw new Error('mock not set up')
                }, createElement: sinon.spy()
            };
            const title = {innerText: ''};
            const getElementByIdMock = sinon.mock(document);
            const resumeData = {academic: [{first: 'item'}, {second: 'item'}], academicTitle: 'academic title'};
            const academicContainer = {appendChild: sinon.spy()};

            getElementByIdMock.expects('getElementById').withArgs('academic').returns(academicContainer);
            getElementByIdMock.expects('getElementById').withArgs('academicTitle').returns(title);

            //action
            rezume.renderAcademic(document, resumeData);
            //assert
            assert.equal(document.createElement.called, false);
            assert.equal(academicContainer.appendChild.called, false);
            getElementByIdMock.verify();
            assert.deepEqual(title.innerText, 'academic title');
        });

        it('should append the 2 elements that have a "show" flag', () => {
            //setup
            const document = {
                getElementById  : () => {
                    throw new Error('mock not set up')
                }, createElement: () => {
                    throw new Error('mock not set up')
                }
            };
            const title = {innerText: ''};
            const documentMock = sinon.mock(document);
            const resumeData = {
                academic     : [{
                    first      : 'item',
                    description: '1st item',
                    year       : 2016,
                    show       : true
                }, {second: 'item'}, {
                    third      : 'item',
                    description: '3rd item',
                    year       : 2016,
                    show       : true
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

            //action
            rezume.renderAcademic(document, resumeData);
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
            //action
            rezume.renderAbout(document, aboutData);
            //assert
            assert.equal(aboutTitle.innerText, 'foo');
            assert.equal(aboutContents.innerText, 'bar');
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
            it(`should not display the ${missingHeader} section if no property is present in headers data`, () => {
                //setup
                const document = {
                    getElementById: () => {
                    }
                };
                const documentMock = sinon.mock(document);
                const missingHeaderElement = {
                    setAttribute: () => {
                    }
                };

                headersList = headersList.filter((headerItem) => {
                    return headerItem !== missingHeader;
                });

                const missingHeaderElementMock = sinon.mock(missingHeaderElement);
                documentMock.expects('getElementById').withExactArgs(`${missingHeader}Container`).once().returns(missingHeaderElement);
                missingHeaderElementMock.expects('setAttribute').withExactArgs('style', 'display:none').once();
                //action
                rezume.hideUnspecifiedHeaders(headersList, document);
                //assert
                documentMock.verify();
                missingHeaderElementMock.verify();
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

            //action
            rezume.renderHeader(resumeData, document);
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

            //action
            rezume.renderHeader(resumeData, document);
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

            //action
            rezume.renderHeader(resumeData, document);
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

            //action
            rezume.renderHeader(resumeData, document);
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

            //action
            rezume.renderHeader(resumeData, document);
            //assert
            assert.equal(randomElement.innerText, 'some random data');
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
            documentMock.expects('getElementById').withExactArgs('random').returns(randomElement);
            documentMock.expects('getElementById').withExactArgs('moreRandom').returns(moreRandomElement);

            //action
            rezume.renderHeader(resumeData, document);
            //assert
            assert.equal(randomElement.innerText, 'some random data');
            assert.equal(moreRandomElement.innerText, 'another property');
        });
    });

    //éviter les boom si on n'a pas l'image qu'il faut pour un assignment
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

            //action
            rezume.renderAssignments(document, resumeData, {}, 'relevant');
            //assert
            assert.equal(title.innerText, 'new title');
            assert.equal(comment.innerText, 'new comment');
            documentMock.verify();
        });

        it('should correctly call the appendAssignment method if 1 assignment is present', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            const resumeData = {
                relevantAssignments: {
                    title: 'new title', comment: 'new comment', list: [
                        {assignment: 'data'}
                    ]
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
            //action
            rezume.renderAssignments(document, resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.deepEqual(rezume.appendAssignmentToList.getCall(0).args, [document, {assignment: 'data'}, undefined, {}]);
        });

        it('should append 2 elements to the assignments list if configured assigments list has 2 elements', () => {
            //setup
            const title = {innerText: 'old text'}, comment = {innerText: 'old comment'};
            const resumeData = {
                relevantAssignments: {
                    title: 'new title', comment: 'new comment', list: [
                        {}, {}
                    ]
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
            //action
            rezume.renderAssignments(document, resumeData, {}, 'relevant');

            //assert
            documentMock.verify();
            assert.equal(rezume.appendAssignmentToList.calledTwice, true);
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
            //action
            rezume.renderAnnex(document, {annex: {skills: {}}});
            //assert
            assert.equal(rezume.renderAnnexBigSection.calledTwice, true);
            assert.equal(rezume.renderAnnexBigSection.getCall(0).args[2], ['publications']);
            assert.equal(rezume.renderAnnexBigSection.getCall(1).args[2], ['misc']);

            assert.equal(rezume.renderAnnexSkillsSection.callCount, 4);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(0).args[2], ['tech']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(1).args[2], ['architecture']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(2).args[2], ['methodologies']);
            assert.equal(rezume.renderAnnexSkillsSection.getCall(3).args[2], ['other']);
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
            //action
            rezume.renderAnnex(document, {annex: {skills: {title: 'annex skills title'}, title: 'annex title'}});
            //assert
            assert.equal(annexTitle.innerText, 'annex title');
            assert.equal(annexSkillsTitle.innerText, 'annex skills title');
        });
    });

    describe('render', () => {
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

            //action
            rezume.render({});
            //assert
            assert.equal(rezume.renderAssignments.calledOnce, true);
            assert.equal(rezume.renderAssignments.getCall(0).args[3], 'relevant');
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

            //action
            rezume.render(document);
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
            //action
            rezume.render(document);
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
                createElement : function () {
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
                createElement : function () {
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
