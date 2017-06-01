import {assert} from 'chai'
import HeadersManager from '../js/HeadersManager';
import sinon from 'sinon';
import utils from '../js/utils'

describe('HeadersManager ', () => {
    let headersManager, getDocumentStub;
    beforeEach(() => {
        headersManager = new HeadersManager();
        getDocumentStub = sinon.stub(utils, 'getDocument');
    });

    afterEach(() => {
       utils.getDocument.restore();
    });

    it('should set the default values for resume header if none are set by the configuration', () => {
        //setup
        //action
        const headersManager = new HeadersManager();
        //assert
        assert.deepEqual(headersManager.expectedHeaders, ['twitter', 'github', 'email', 'name', 'addressLine1', 'addressLine2', 'position', 'phone', 'picture']);
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
                headersManager.expectedHeaders = [].concat(headersList);
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
                getDocumentStub.returns(document);

                //action
                headersManager.hideUnspecifiedHeaders(headersList);
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
            sinon.stub(headersManager, 'hideUnspecifiedHeaders');
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader(resumeData);
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
            sinon.stub(headersManager, 'hideUnspecifiedHeaders');
            getDocumentStub.returns(document);


            //action
            headersManager.renderHeader(resumeData);
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
            sinon.stub(headersManager, 'hideUnspecifiedHeaders');
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader(resumeData);
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
            sinon.stub(headersManager, 'hideUnspecifiedHeaders');
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader(resumeData);
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
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader(resumeData);
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
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader(resumeData);
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
            getDocumentStub.returns(document);

            //action
            headersManager.renderHeader({});
            //assert
            assert.equal(getElementSpy.callCount, 0);
        });
    });
});
