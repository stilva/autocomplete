import nock from 'nock';
import Request from './Request';

const API_END_POINT = 'http://localhost';
const SUCCESSFUL_RESPONSE = {result: [{}, {}, {}]};
const FAILED_RESPONSE = {result: []};

describe('Request object passes xhr responses to callbacks', () => {
  let nockScope;

  beforeEach(() => {
    nockScope = nock(API_END_POINT)
      .defaultReplyHeaders({'access-control-allow-origin': '*'})
      .get('/')
      .query(({query: 'success'}))
      .reply(200, SUCCESSFUL_RESPONSE);

    nockScope = nock(API_END_POINT)
      .defaultReplyHeaders({'access-control-allow-origin': '*'})
      .get('/')
      .query(({query: 'failed'}))
      .reply(200, FAILED_RESPONSE);

    nockScope = nock(API_END_POINT)
      .defaultReplyHeaders({'access-control-allow-origin': '*'})
      .get('/')
      .query(({wrong: 'query'}))
      .replyWithError(null);
  });

  afterAll(() => {
    nockScope.cleanAll();
  });

  it('calls onComplete with results', done => {
    const req = new Request(`${API_END_POINT}?query=success`);
    req.onComplete(function onRequestComplete(res) {
      expect(res).toHaveProperty('result');
      expect(res.result).toHaveLength(SUCCESSFUL_RESPONSE.result.length);

      done();
    });
  });

  it('calls onComplete with empty result', done => {
    const req = new Request(`${API_END_POINT}?query=failed`);
    req.onComplete(function onRequestComplete(res) {
      expect(res).toHaveProperty('result');
      expect(res.result).toHaveLength(FAILED_RESPONSE.result.length);

      done();
    });
  });

  it('calls onError', done => {
    const onError = jest.fn();
    const onComplete = jest.fn();

    const req = new Request(`${API_END_POINT}?wrong=query`);
    req.onError(onError);
    req.onComplete(onComplete);

    setTimeout(_ => {
      expect(onError).toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      done();
    }, 100);
  });
});
