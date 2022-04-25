import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './assets/css/_layout.shared.scss';
import './assets/css/_layout.styles.scss';
import './assets/css/_layout.search.scss';
import LoadingIcon from "./components/LoadingIcon";
import About from "./pages/About";
import Login from "./pages/Login";
import Search from "./pages/Search";
import { AuthRoute } from "./routes/AuthRoute";
import NotFound from "./pages/NotFound";
import Logout from "./pages/Logout";
import Navigation from "./components/partials/Navigation";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Navigation/>
        <Switch>
          <Redirect exact path="/" to="/login"/>
          <Route exact path="/login" component={Login}/>
          <AuthRoute exact path="/search" component={Search}/>
          <AuthRoute exact path="/about" component={About}/>
          <Route exact path="/logout" component={Logout}/>
          <Route exact path="/404" component={NotFound}/>
          <Redirect to="/404"/>
        </Switch>
        <LoadingIcon/>
      </BrowserRouter>
    );
  }
}

export default App;
