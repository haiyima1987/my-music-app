import * as React from 'react';
import { connect } from "react-redux";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreRootState } from "../store";

interface Props {
  isLoading?: boolean;
}

function mapStateToProps(state: StoreRootState) {
  return {
    isLoading: state.shared.isLoading
  }
}

class LoadingIcon extends React.Component<Props> {
  render() {
    return (
      <div>
        {this.props.isLoading
          ? (<div className="spinner">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>
          </div>)
          : undefined}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null,
)(LoadingIcon);
