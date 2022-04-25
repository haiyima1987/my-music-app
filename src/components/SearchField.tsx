import * as React from 'react';
import { ChangeEvent } from "react";

interface Props {
  changeCallback: Function;
  searchCallback: Function;
}

interface State {
  searchTerm: string;
}

const KEY_ENTER = 'Enter';

class SearchField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchTerm: ''
    }
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = (e.target as HTMLInputElement).value;
    /** update parent values **/
    this.props.changeCallback(searchTerm);
    this.setState({searchTerm});
  }

  onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER) {
      if (this.state.searchTerm === '') return;
      /** fire the call and clear up **/
      this.props.searchCallback((e.target as HTMLInputElement).value);
      this.setState({searchTerm: ''});
    }
  }

  render() {
    return (
      <div className="search-field-box">
        <label htmlFor="searchField" className="label-search-field">
          <input
            className="form-input input-search-field"
            id="searchField"
            name="searchField"
            value={this.state.searchTerm}
            onChange={this.handleChange}
            onKeyUp={this.onKeyUp}
            placeholder="Enter search term"
            type="text"/>
        </label>
      </div>
    );
  }
}

export default SearchField;
