import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DelayLink from 'react-delay-link';
import axios from 'axios';
import { Query } from "@apollo/client/react/components";
import { QUERY_GET_EMPLOYER_BY_EMAIL, QUERY_GET_WORKER_BY_EMAIL } from './queries';
import {client} from '../index.js';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setAccountType = this.setAccountType.bind(this);
      }
    
      state = {
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        accountType: "Employer",
        accountValid: true,
        nextPage: "/tasks",
        skills: null,
        location: null,
      };
    
    signIn(queryToExecute) {
        localStorage.setItem('email', this.state.email);
        localStorage.setItem('accountType', this.state.accountType);

        client.query({
            query: queryToExecute,
            variables: {email: this.state.email},
        })
        .then((res) => {
            console.log("query data");
            console.log(res.data);
            if(this.state.accountType === "Employer") {
                if(res.data.employersByEmail.length > 0) {
                    console.log(res.data.employersByEmail[0]);
                    this.setState({userId: res.data.employersByEmail[0].id});
                    this.setState({firstName: res.data.employersByEmail[0].firstName});
                    this.setState({lastName: res.data.employersByEmail[0].lastName});
                    localStorage.setItem('userId', res.data.employersByEmail[0].id);
                    localStorage.setItem('firstName', res.data.employersByEmail[0].firstName);
                    localStorage.setItem('lastName', res.data.employersByEmail[0].lastName);
                } else {
                    return;
                }
            } else {
                if(res.data.workersByEmail.length > 0) {
                    console.log(res.data.workersByEmail[0]);
                    this.setState({userId: res.data.workersByEmail[0].id});
                    this.setState({firstName: res.data.workersByEmail[0].firstName});
                    this.setState({lastName: res.data.workersByEmail[0].lastName});
                    this.setState({skills: res.data.workersByEmail[0].skills});
                    localStorage.setItem('userId', res.data.workersByEmail[0].id);
                    localStorage.setItem('firstName', res.data.workersByEmail[0].firstName);
                    localStorage.setItem('lastName', res.data.workersByEmail[0].lastName);
                    localStorage.setItem('skills', JSON.stringify(res.data.workersByEmail[0].skills));
                    console.log(res.data.workersByEmail[0].currentJob);
                    if(res.data.workersByEmail[0].currentJob != null){
                        localStorage.setItem('taskAssignedDescription', res.data.workersByEmail[0].currentJob.description);
                        localStorage.setItem('taskAssignedLocation', JSON.stringify(res.data.workersByEmail[0].currentJob.location));
                    } else {
                        localStorage.setItem('taskAssignedDescription', null);
                        localStorage.setItem('taskAssignedLocation', null);
                    }
                } else {
                    return;
                }
            }
        })
    }

    setEmail(event) {
        this.setState({email: event.target.value});
    }

    setPassword(event) {
        this.setState({password: event.target.value});
    }

    setAccountType(event) {
        this.setState({accountType: event.target.value});
    }

    render() {
        var pathname = this.state.accountType === "Employer" ? "/tasks" : "/assignments";
        pathname = this.state.accountValid ? pathname : "/";
        var queryToExecute = this.state.accountType === "Employer" ? QUERY_GET_EMPLOYER_BY_EMAIL : QUERY_GET_WORKER_BY_EMAIL;

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
            <form>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email"  onChange={this.setEmail}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password"  onChange={this.setPassword}/>
                </div>

                <div className="form-group">
                    <label>Account Type</label>
                    <select type="select" className="form-control" onChange={this.setAccountType} value={this.state.accountType}>
                        <option defaultValue>Employer</option>
                        <option>Worker</option>
                    </select>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <DelayLink delay={1000} to={{pathname: pathname, state: {userId: this.state.userId, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, accountType: this.state.accountType}}}>
                    <Query variables={{
                        email: this.state.email,
                    }} 
                    query={queryToExecute}>
                        {
                            () => {
                            return (
                                <button id="submitButton" type="submit" className="btn btn-primary btn-block" onClick={() => this.signIn(queryToExecute)}>Sign In</button>
                                );
                            }
                        }
                    </Query>
                </DelayLink>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
                </div>
            </div>
        );
    }
}