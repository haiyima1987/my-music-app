import * as React from 'react';
import { Dispatch } from "redux";
import authSlice from "../store/auth";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

interface Props {
  logout: Function;
  history: RouteComponentProps["history"];
}

const {logout} = authSlice.actions;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    logout: (payload: any) => dispatch(logout(payload))
  }
}

class Logout extends React.Component<Props> {
  componentDidMount() {
    this.logout();
  }

  logout = () => {
    this.props.logout();
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="container">
        <p>logging out...</p>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Logout);
