import * as React from 'react';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RESULT_TYPES } from "../../models/DomHelpers";

interface Props {
  type: string;
}

class NotResult extends React.Component<Props> {
  getContent = () => {
    if (this.props.type === RESULT_TYPES.NO_RESULT) {
      return <div>
        <h1>Oops?</h1>
        <h3 className="text-below-no-result">No result. Try another search term please.</h3>
      </div>
    } else {
      return <div>
        <h1>Ready?</h1>
        <h3 className="text-below-no-result">Enter your search term to find what you want.</h3>
      </div>
    }
  }

  render() {
    return (
      <div className="container">
        <div className="no-result-wrapper">
          <FontAwesomeIcon icon={faSearch} className="fa-search icon-no-result"/>
          {this.getContent()}
        </div>
      </div>
    );
  }
}

export default NotResult;
