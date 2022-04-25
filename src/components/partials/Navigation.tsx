import * as React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
  render() {
    return (
      <nav className="navigation-section-wrapper">
        <div className="container">
          <div className="navigation-wrapper">
            <Link to="/search" className="icon-navigation-wrapper">
              <img src={require('../../assets/img/avatar_spotify.png')} alt="logo"
                   className="icon-navigation"/>
            </Link>
            <Link to="/search" className="item-navigation">Home</Link>
            <Link to="/about" className="item-navigation">About</Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
