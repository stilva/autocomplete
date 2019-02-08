jest.mock('./Request');

import Autocomplete from './Autocomplete';
import Request from './Request';

const API_END_POINT = 'http://localhost';

describe('Autocomplete accepts various endpoint types', () => {
  const THROTTLE_VALUE = 1000;

  beforeEach(() => {
    Request.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('accepts a string', () => {
    const queryKey = 'lorem-ipsum';
    const ac = new Autocomplete(API_END_POINT);
    ac.request(queryKey);

    jest.runTimersToTime(THROTTLE_VALUE);

    expect(Request.mock.calls[0][0]).toEqual(`${API_END_POINT}/${queryKey}`);
  });

  it('accepts a parsing function', () => {
    const queryKey = 'lorem-ipsum';

    const ac = new Autocomplete(key => `${API_END_POINT}?query=${key}`);
    ac.request(queryKey);

    jest.runTimersToTime(THROTTLE_VALUE);

    expect(Request.mock.calls[0][0]).toEqual(`${API_END_POINT}?query=${queryKey}`);
  });
});

describe('Autocomplete handles requests\' lifecycle', () => {
  const THROTTLE_VALUE = 1000;

  beforeEach(() => {
    Request.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles requests', () => {
    const ac = new Autocomplete(API_END_POINT, THROTTLE_VALUE);
    ac.request('hi');
    ac.request('hello');

    jest.runTimersToTime(THROTTLE_VALUE);

    expect(Request.mock.calls[0][0]).toEqual(`${API_END_POINT}/hello`);
  });

  it('invokes request\'s abort method', () => {
    const ac = new Autocomplete(API_END_POINT, THROTTLE_VALUE);
    ac.request('hi');

    jest.runTimersToTime(THROTTLE_VALUE);

    ac.request('hello');

    jest.runTimersToTime(THROTTLE_VALUE);

    expect(Request.mock.instances[0].abort).toHaveBeenCalled();
    expect(Request.mock.calls[0][0]).toEqual(`${API_END_POINT}/hi`);
    expect(Request.mock.calls[1][0]).toEqual(`${API_END_POINT}/hello`);
  });
});
