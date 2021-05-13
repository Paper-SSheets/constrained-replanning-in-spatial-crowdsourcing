import gql from 'graphql-tag';
import { LocationInput } from '../classes/LocationInput';
import { SkillInput } from '../classes/SkillInput';

export const MUTATE_EMPLOYER_ACCOUNT = gql`
mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
){
  createEmployer(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
    id
    firstName
    lastName
    email
  }
}
`;

export const MUTATE_WORKER_ACCOUNT = gql`
mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
){
  createWorker(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
    id
    firstName
    lastName
    email
  }
}
`;

export const MUTATE_WORKER_ACCOUNT_ADD_LOCATION = gql`
mutation(
    $id: ID!
    $location: LocationInput
){
  updateWorker(id: $id, location: $location) {
    id
  }
}
`;

export const MUTATE_WORKER_ACCOUNT_ADD_SKILL = gql`
mutation(
    $id: ID!
    $skills: [SkillInput]
){
  updateWorker(id: $id, skills: $skills) {
    id
  }
}
`;

export const MUTATE_JOBS = gql`
mutation(
    $employerId: String!
    $location: LocationInput!
    $description: String!
    $desiredSkills: [SkillInput]
){
  createJob(employerId: $employerId, location: $location, description: $description, desiredSkills: $desiredSkills) {
    id
  }
}
`;
