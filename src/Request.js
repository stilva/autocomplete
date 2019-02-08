export default class Request {
  constructor(uri) {
    const scope = this;
    const xhr = new XMLHttpRequest();

    this._xhr = xhr;

    xhr.responseType = 'json';

    xhr.addEventListener('load', function(e) {
      scope._onComplete && scope._onComplete.call(scope, this.response);
    });

    xhr.addEventListener('error', function(e) {
      scope._onError && scope._onError.call(scope, this.response);
    });

    xhr.open('GET', uri);

    xhr.send();
  }

  abort() {
    this._xhr && this._xhr.abort();
  }

  onComplete(callback) {
    this._onComplete = callback;
  }

  onError(callback) {
    this._onError = callback;
  }
}
