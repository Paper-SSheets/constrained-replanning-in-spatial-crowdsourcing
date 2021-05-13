import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
import { Mutation } from "@apollo/client/react/components";
import { MUTATE_WORKER_ACCOUNT_ADD_LOCATION } from './mutations';
import { SkillInput } from '../classes/SkillInput';
import { LocationInput } from '../classes/LocationInput';

export default class Assignments extends Component {
  constructor(props) {
    super(props);
    this.addLocation = this.addLocation.bind(this);
  } 

  state = {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    skills: [],
    location: null,
    tasks: [],
    taskDescription: null,
    taskLocation: null,
  };

  addLocation(addLocation) {
    addLocation()
      .then(res => {
        console.log("post response");
        console.log(res);
      })
  }

  async componentDidMount() {
    if (this?.props?.location?.state !== undefined) {
      this.setState({firstName: this.props.location.state.firstName});
      this.setState({lastName: this.props.location.state.lastName});
      this.setState({email: this.props.location.state.email});
    }

    this.setState({userId: localStorage.getItem('userId')});
    this.setState({skills: JSON.parse(localStorage.getItem('skills'))});

    this.setState({taskDescription: localStorage.getItem('taskAssignedDescription')});
    this.setState({taskLocation: JSON.parse(localStorage.getItem('taskAssignedLocation'))});

    if ("geolocation" in navigator) {
      console.log("Available");
    } else {
      console.log("Not Available");
    }

    // Only will work if location is allowed (if "Available" is printed above)
    this.updateLocation();
    this.interval = setInterval(() => this.updateLocation(), 10000);
  }

  async updateLocation() {
    console.log("updating location");
    var position = await this.getPosition();
    this.setState({location: new LocationInput(position.coords.latitude, position.coords.longitude)});
    localStorage.setItem('location', JSON.stringify(new LocationInput(position.coords.latitude, position.coords.longitude)));
    var addLocationDiv = document.getElementById("addLocationDiv");
    addLocationDiv.click();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  // timeout(delay) {
  //   return new Promise(res => setTimeout(res, delay) );
  // }

  render() {
    console.log("THIS BAD BOY");
    console.log(this.state.location);
    console.log(this.state.taskLocation);
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
      <div>
        <Link to={{pathname: '/skills', state: {userId: this.state.userId, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, skills: this.state.skills}}}>
          <button type="button" className="btn btn-primary">View My Skills</button>
        </Link>

        <Mutation variables={{
          id: this.state.userId,
          location: this.state.location
        }} mutation={MUTATE_WORKER_ACCOUNT_ADD_LOCATION}>
          {
              (addLocation) => {
              return (
                  <div style={{visibility: 'hidden'}} id="addLocationDiv" onClick={() => this.addLocation(addLocation)}></div>
                  );
              }
          }
        </Mutation>
        <ul className="list-group">
          <li className="list-group-item"><b>Tasks Assigned To Me</b></li>
          {this.state.taskDescription == null || this.state.taskDescription == "null" ? <p>You have no tasks to complete right now!</p> : <Link to={{pathname: '/map', state: {location: this.state.location, taskLocation: this.state.taskLocation}}}><li className="list-group-item">{this.state.taskDescription}</li></Link>}
        </ul>
      </div>
        </div>
      </div>
    )
  }
}
