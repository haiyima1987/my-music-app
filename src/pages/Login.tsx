import * as React from 'react';
import { connect } from "react-redux";
import { login } from "../store/auth/actions";
import { RouteComponentProps } from "react-router";

interface Props {
  login: Function;
  history: RouteComponentProps["history"];
}

interface State {
  positionTop: string;
  showOverlay: boolean;
  opacity: number;
}

/** here use a panel to "force login" the user. the login is done by client_id and client_secret **/
class Login extends React.Component<Props, State> {
  private transitionDelay: number = 400;
  private initialDelay: number = 100;

  constructor(props: Props) {
    super(props);
    /** some properties for animation **/
    this.state = {
      positionTop: '120%',
      showOverlay: true,
      opacity: 1
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.showPanel();
    }, this.initialDelay);
  }

  sendLogin = () => {
    this.props.login().then(() => {
      this.closePanel();
    });
  }

  showPanel = () => {
    this.setState({positionTop: '50%'})
  }

  closePanel = () => {
    this.setState({
      positionTop: '120%',
      opacity: 0
    });
    setTimeout(() => {
      this.props.history.push('/search');
    }, this.transitionDelay);
  }

  render() {
    return (
      <div>
        {this.state.showOverlay ?
          <div style={{opacity: this.state.opacity}} className="panel-login-overlay">
            <div style={{top: this.state.positionTop}} className="panel-login">
              <img src={require(`../assets/img/spotify_logo_text.svg`)} alt="spotify"
                   className="icon-logo-login-panel"/>
              <h1>Music finder</h1>
              <h3 className="subtitle-login-panel">Click the button below to use the music finder</h3>
              <button onClick={this.sendLogin} className="button-login-panel button-main">
                Go!
              </button>
            </div>
          </div> : undefined}
      </div>
    );
  }
}

export default connect(
  null,
  {login}
)(Login);
