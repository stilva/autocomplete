/* @jsx h */
import {h, Component} from 'preact';
import Autocomplete from './Autocomplete';

export default class PreactAutocomplete extends Component {
  constructor(props) {
    super(props);

    if (!props || !props.uri || typeof props.children[0] !== 'function') {
      throw new Error('Invalid props');
    }

    this.state = {
      searchResults: ''
    };

    this.autoComplete = new Autocomplete(props.uri, props.throttleTime);
    this.autoComplete.onComplete(this.onSuccess.bind(this));
    this.autoComplete.onError(_ => this.setState({searchResults: {isError: true}}));
  }

  onSuccess(result = []) {
    this.setState({searchResults: {result, isError: false}});
  }

  render() {
    return this.props.children[0](
      (key = '') => {
        if(key.length === 0) {
          this.onSuccess([]);
        } else {
          this.autoComplete.request(key);
        }
      },
      this.state.searchResults
    );
  }
}
