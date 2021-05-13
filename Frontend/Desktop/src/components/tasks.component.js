import React, { Component } from "react";
import axios from 'axios';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Mutation } from "@apollo/client/react/components";
import { Query } from "@apollo/client/react/components";
import {client} from '../index.js';
import { MUTATE_JOBS } from './mutations';
import { QUERY_GET_JOBS_BY_EMPLOYER } from './queries';
import { LocationInput } from '../classes/LocationInput';
import { SkillInput } from '../classes/SkillInput';
mapboxgl.accessToken = 'pk.eyJ1IjoibG9ncmFuZCIsImEiOiJja2w4Y2gwMGoyNGwxMm9xajM1YWJ6YmJnIn0.l4ocHpd5Wy5fJXGumuayUA';

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.addTask = this.addTask.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setTaskDescription = this.setTaskDescription.bind(this);
    this.setSkillRequired = this.setSkillRequired.bind(this);
  }

  state = {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    taskDescription: "",
    taskLocation: null,
    skillRequired: [],
    tasksCreated: [],
    showModal: false,
  };

  addTask(addTask) {
    addTask()
      .then(res => {
        console.log("post response");
        console.log(res);
      })
    this.toggleModal();
  }

  toggleModal() {
    console.log(this.state.userId);
    console.log(this.state.taskLocation);
    console.log(this.state.taskDescription);
    console.log(this.state.skillRequired);
    const currentState = this.state.showModal;
    this.setState({showModal: !currentState});
  };

  setTaskDescription(event) {
    this.setState({taskDescription: event.target.value});
  }

  setSkillRequired(event) {
    this.setState({skillRequired: [new SkillInput(event.target.value, 3)]});
  }

  componentDidMount() {
    this.setState({userId: localStorage.getItem('userId')});
    if (this?.props?.location?.state !== undefined) {
      this.setState({email: this.props.location.state.email})
    }

    client.query({
      query: QUERY_GET_JOBS_BY_EMPLOYER,
      variables: {employerId: localStorage.getItem('userId')},
    })
    .then((res) => {
        console.log("query data");
        console.log(res.data);
        var tasksCreated = [];
        for (var i = 0; i < res.data.jobsByEmployerId.length; i++){
          tasksCreated.push(res.data.jobsByEmployerId[i].description);
        }
        this.setState({tasksCreated: tasksCreated});
    })

    var geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken});
    geocoder.addTo('#TaskLocationInput');

    geocoder.on('result', (e) => {
      let coords = e.result.center
      this.setState({taskLocation: new LocationInput(coords[1], coords[0])});
    })
  }

  render() {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
      <div>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createTaskModal" onClick={this.toggleModal}>
          Create Task
        </button>

        <div className={this.state.showModal ? 'modal modalShow': 'modal modalHide'}  id="createTaskModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Create Task</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.toggleModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <input id="taskEntered" type="text" className="form-control" placeholder="Enter a Title for or Short Description of the Task" onChange={this.setTaskDescription}/>
                </div>
                <div className="form-group">
                  <input id="skillRequired" type="text" className="form-control" placeholder="Enter Skill Required" onChange={this.setSkillRequired}/>
                </div>
                <div>Enter Task Location</div>
                <div id="TaskLocationInput"></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.toggleModal}>Close</button>
                <Mutation variables={{
                        employerId: this.state.userId,
                        location: this.state.taskLocation,
                        description: this.state.taskDescription,
                        desiredSkills: this.state.skillRequired
                    }} mutation={MUTATE_JOBS}>
                        {
                            (addTask) => {
                            return (
                              <button type="button" className="btn btn-primary" onClick={() => this.addTask(addTask)}>Save changes</button>
                                );
                            }
                        }
                </Mutation>
              </div>
            </div>
          </div>
        </div>

        <ul className="list-group">
          <li className="list-group-item"><b>Tasks Created By Me</b></li>
          {this.state.tasksCreated != null ? this.state.tasksCreated.map(task => <li className="list-group-item">{task}</li>) : <p>You haven't created any tasks yet!</p>}
        </ul>
      </div>
            </div>
        </div>
    )
  }
}
