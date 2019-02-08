import Request from './Request';

export default class Autocomplete {
  constructor(apiEndpoint, throttleTime = 150) {
    this._parseURI = typeof apiEndpoint === 'string'
      ? preNormaliseEndpoint(apiEndpoint)
      : apiEndpoint;

    this._throttleTime = throttleTime;

    this._activeRequest = null;

    this._onError = noop;
    this._onComplete = noop;
  }

  request(key) {
    clearTimeout(this._intervalID);
    this._intervalID = setTimeout(_ => {
      if(this._activeRequest) {
        this._activeRequest.abort();
      }
      this._activeRequest = new Request(this._parseURI(key));
      this._activeRequest.onError(this._onError);
      this._activeRequest.onComplete(this._onComplete);
    }, this._throttleTime);
  }

  onComplete(cb) {
    this._onComplete = cb;
  }

  onError(cb) {
    this._onError = cb;
  }
};

function preNormaliseEndpoint(apiEndpoint) {
  const normalisedEndpoint = normaliseEndpoint(apiEndpoint);

  return key => `${normalisedEndpoint}${key}`;
}

function normaliseEndpoint(apiEndpoint) {
  const lastChar = apiEndpoint.substr(-1);

  if(lastChar == '=' || lastChar == '/') return apiEndpoint;

  return `${apiEndpoint}/`;
}

function noop() {}
