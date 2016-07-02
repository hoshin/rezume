import {assert} from 'chai'
import {Rezume} from '../js/rezume';
import sinon from 'sinon';

describe('rezume', () => {
    let rezume;
    beforeEach(() => {
        rezume = new Rezume();
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
            documentMock.expects('getElementById').withExactArgs('random').returns(randomElement);            documentMock.expects('getElementById').withExactArgs('random').returns(randomElement);
            documentMock.expects('getElementById').withExactArgs('moreRandom').returns(moreRandomElement);

            //action
            rezume.renderHeader(resumeData, document);
            //assert
            assert.equal(randomElement.innerText, 'some random data');
            assert.equal(moreRandomElement.innerText, 'another property');
        });
    });
});
