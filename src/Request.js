export default class Request {
  constructor(uri) {
    const scope = this;
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function(e) {
      scope._onComplete.call(scope, this.response);
    });

    xhr.addEventListener('error', function(e) {
      try {
        scope._onError.call(scope, this.response);
      } catch(e) {}
    });

    xhr.open('GET', uri);

    xhr.send();

    this._xhr = xhr;
  }

  abort() {
    this._xhr.abort();
  }

  onComplete(callback) {
    this._onComplete = callback;
  }

  onError(callback) {
    this._onError = callback;
  }
}
