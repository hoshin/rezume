import {assert} from 'chai'
import sinon from 'sinon';
import utils from '../js/utils';

describe('utils', () => {
    describe('lookupPicture', () => {
        it('should return the location passed as parameter if it is a URL', () => {
            //setup
            //action
            const actual = utils.lookupPicture('http://foo.bar', {});
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
            const actual = utils.lookupPicture('foo', document);
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
            const actual = utils.lookupPicture('foo', document);
            //assert
            assert.equal(actual, '');
            documentMock.verify();
        });
    });
});