import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DelayLink from 'react-delay-link';
import axios from 'axios';
import { Mutation } from "@apollo/client/react/components";
import { MUTATE_EMPLOYER_ACCOUNT, MUTATE_WORKER_ACCOUNT } from './mutations';
import { SkillInput } from '../classes/SkillInput';
import { LocationInput } from '../classes/LocationInput';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
        this.verifyCredentials = this.verifyCredentials.bind(this);
        this.setFirstName = this.setFirstName.bind(this);
        this.setLastName = this.setLastName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setAccountType = this.setAccountType.bind(this);
        // this.timeout = this.timeout.bind(this);
      }

      state = {
        userId: null,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        accountType: "Employer",
        accountValid: false,
        nextPage: "/tasks",
        skills: null,
        location: null
      };

    createAccount(createEmployer) {
        this.verifyCredentials();
        if (!this.state.accountValid) {
            console.log("account was invalid");
            return;
        }

        localStorage.setItem('firstName', this.state.firstName);
        localStorage.setItem('lastName', this.state.lastName);
        localStorage.setItem('email', this.state.email);
        localStorage.setItem('accountType', this.state.accountType);

        createEmployer()
          .then(res => {
            console.log("post response");
            console.log(res);
            if(this.state.accountType === "Employer") {
                console.log(res.data.createEmployer.id);
                this.setState({userId: res.data.createEmployer.id})
                localStorage.setItem('userId', res.data.createEmployer.id);
            } else {
                console.log(res.data.createWorker.id);
                this.setState({userId: res.data.createWorker.id})
                localStorage.setItem('userId', res.data.createWorker.id);
                localStorage.setItem('skills', null);
            }
          })
    }

    verifyCredentials() {
        var invalid = this.state.firstName.length === 0 || this.state.lastName.length === 0 || this.state.email.length === 0 || this.state.password.length === 0;
        this.setState({accountValid: !invalid});
    }

    setFirstName(event) {
        this.verifyCredentials();
        this.setState({firstName: event.target.value});
    }

    setLastName(event) {
        this.verifyCredentials();
        this.setState({lastName: event.target.value});
    }

    setEmail(event) {
        this.verifyCredentials();
        this.setState({email: event.target.value});
    }

    setPassword(event) {
        this.verifyCredentials();
        this.setState({password: event.target.value});
    }

    // timeout(delay) {
    //     return new Promise( res => setTimeout(res, delay) );
    // }

    setAccountType(event) {
        this.verifyCredentials();
        this.setState({accountType: event.target.value});
        // await this.timeout(1000);
    }

    render() {
        var pathname = this.state.accountType === "Employer" ? "/tasks" : "/assignments";
        pathname = this.state.accountValid ? pathname : "/"
        var mutationToExecute = this.state.accountType === "Employer" ? MUTATE_EMPLOYER_ACCOUNT : MUTATE_WORKER_ACCOUNT;

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
            <form>
                <h3>Sign Up</h3>

                <div className="form-row">
                    <div className="col form-group">
                        <label>First name</label>
                        <input type="text" className="form-control" placeholder="First name" onChange={this.setFirstName}/>
                    </div>

                    <div className="col form-group">
                        <label>Last name</label>
                        <input type="text" className="form-control" placeholder="Last name" onChange={this.setLastName}/>
                    </div>
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={this.setEmail}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={this.setPassword}/>
                </div>

                <div className="form-group">
                    <label>Account Type</label>
                    <select type="select" className="form-control" onChange={this.setAccountType} value={this.state.accountType}>
                        <option defaultValue>Employer</option>
                        <option>Worker</option>
                    </select>
                </div>

                <DelayLink delay={1000} to={{pathname: pathname, state: {userId: this.state.userId, firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, accountType: this.state.accountType}}}>
                    <Mutation variables={{
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        password: this.state.password
                    }} mutation={mutationToExecute}>
                        {
                            (createEmployer) => {
                            return (
                                <button type="submit" className="btn btn-primary btn-block" onClick={() => this.createAccount(createEmployer)}>Sign Up</button>
                                );
                            }
                        }
                    </Mutation>
                </DelayLink>
                <p className="forgot-password text-right">
                    Already registered <a href="../sign-in">sign in?</a>
                </p>
            </form>
                </div>
            </div>
        );
    }
}