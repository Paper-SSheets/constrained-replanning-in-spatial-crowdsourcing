import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Tasks from "./components/tasks.component";
import Assignments from "./components/assignments.component";
import Skills from "./components/skills.component";
import MapPage from "./components/map.component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -93.6429,
      lat: 42.0339,
      zoom: 12,
      start: [-93.6429, 42.0339],
      end: [-93.663740, 42.003480]
    };
  }

  render() {
    return (<Router>
          <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
              <div className="container">
                <Link className="navbar-brand" to={"/sign-in"}>sdmay21-51</Link>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-in"}>Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/tasks"}>Tasks</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/assignments"}>Assignments</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/skills"}>Skills</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/map"}>MapPage</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

                <Switch>
                  <Route exact path='/' component={SignUp}/>
                  <Route path="/sign-up" component={SignUp}/>
                  <Route path="/sign-in" component={Login}/>
                  <Route path="/tasks" component={Tasks}/>
                  <Route path="/assignments" component={Assignments}/>
                  <Route path="/skills" component={Skills}/>
                  <Route path="/map" component={MapPage}/>
                </Switch>
          </div>
        </Router>
    );
  }
}

export default App;