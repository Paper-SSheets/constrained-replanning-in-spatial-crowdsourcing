import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Badge from 'react-bootstrap/Badge'
import axios from 'axios';
import { Mutation } from "@apollo/client/react/components";
import { MUTATE_WORKER_ACCOUNT_ADD_SKILL } from './mutations';
import { SkillInput } from '../classes/SkillInput';
import { LocationInput } from '../classes/LocationInput';

export default class Skills extends Component {
  constructor(props) {
    super(props);
    this.addSkill = this.addSkill.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setNewSkillName = this.setNewSkillName.bind(this);
    this.setNewSkillRating = this.setNewSkillRating.bind(this);
  } 

  state = {
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    skills: [],
    location: null,
    showModal: false,
    newSkill: null,
  };

  addSkill(addSkill) {
    addSkill()
      .then(res => {
        console.log("post response");
        console.log(res);
      })
    this.setState({skills: this.state.skills == null ? [this.state.newSkill] : [...this.state.skills, ...[this.state.newSkill]]});
    this.toggleModal();
  }

  toggleModal() {
    console.log("toggleModal");
    console.log(this.state.showModal);
    const currentState = this.state.showModal;
    this.setState({showModal: !currentState});
  };

  setNewSkillName(event) {
    var rating = null;
    if (this?.state?.newSkill?.rating != null) {
      rating = this.state.newSkill.rating;
    }
    this.setState({newSkill: new SkillInput(event.target.value, rating)});
  }

  setNewSkillRating(event) {
    var name = null;
    if (this?.state?.newSkill?.name != null) {
      name = this.state.newSkill.name;
    }
    this.setState({newSkill: new SkillInput(name, event.target.value)});
  }

  updateNewSkill() {
    var name = document.getElementById("skillEntered").value;
    var rating = document.getElementById("skillRatingEntered").value;
    this.setState({newSkill: new SkillInput(name, rating)});
  }

  componentDidMount() {
    if (this?.props?.location?.state !== undefined) {
      this.setState({userId: this.props.location.state.userId});
      if (this.props.location.state.skills == "null") {
        this.setState({skills: null});
      } else {
        this.setState({skills: this.props.location.state.skills});
      }
    }
    this.interval = setInterval(() => this.updateNewSkill(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
      <div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addSkillModal" onClick={this.toggleModal}>
          Add Skill
        </button>

        <div className={this.state.showModal ? 'modal modalShow': 'modal modalHide'}  id="addSkillModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Skill</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.toggleModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <input id="skillEntered" type="text" className="form-control" placeholder="Enter Skill" onChange={this.setNewSkillName}/>
                </div>
                <div className="form-group">
                  <input id="skillRatingEntered" type="text" className="form-control" placeholder="Enter Skill Proficiency (1-5)" onChange={this.setNewSkillRating}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.toggleModal}>Close</button>
                <Mutation variables={{
                        id: this.state.userId,
                        skills: this.state.skills == null ? [this.state.newSkill] : [...this.state.skills, ...[this.state.newSkill]]
                    }} mutation={MUTATE_WORKER_ACCOUNT_ADD_SKILL}>
                        {
                            (addSkill) => {
                            return (
                              <button type="button" className="btn btn-primary" onClick={() => this.addSkill(addSkill)}>Save changes</button>
                                );
                            }
                        }
                </Mutation>
              </div>
            </div>
          </div>
        </div>

        <ul className="list-group">
          <li className="list-group-item"><b>My Skills</b></li>
          {this.state.skills != null ? this.state.skills.map(skill => <li className="list-group-item d-flex justify-content-between align-items-center">{skill.name}<Badge>{skill.rating}</Badge></li>) : <p>You haven't added any skills yet!</p>}
        </ul>
      </div>
            </div>
        </div>
    )
  }
}
