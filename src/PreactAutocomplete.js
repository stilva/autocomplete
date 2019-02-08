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
    this.autoComplete.onComplete(result => this.setState({searchResults: {result, isError: false}}));
    this.autoComplete.onError(_ => this.setState({searchResults: {isError: true}}));
  }

  render() {
    return this.props.children[0](
      key => this.autoComplete.request(key),
      this.state.searchResults
    );
  }
}
