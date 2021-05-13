## Some sample queries

```graphql
query getAllEmployers {
    employers {
        id
        firstName
        lastName
        email
    }
}

query getAllWorkers {
    workers {
        id
        firstName
        lastName
        email
        skills {
            name
            rating
        }
        location {
            longitude
            latitude
        }
    }
}

query getAllJobs {
    jobs {
        id
        employer {
            id
            firstName
        }
        worker {
            id
            firstName
        }
        location {
            longitude
            latitude
        }
        description
        desiredSkills {
            name
            rating
        }
    }
}

mutation createWorker {
    createWorker(firstName: "Yousef", lastName: "Absi", email: "gg@gmail.com", password: "adfh", skills: [{name: "Java", rating: 5}], location: {latitude: 42.0308, longitude: 93.6319}) {
        firstName
        lastName
        skills {
            name
            rating
        }
        location {
            latitude
            longitude
        }
    }
}

mutation updateWorker {
    updateWorker(id: "60612c7d7785ed6cffc324e7", firstName: "yousef") {
        firstName
        lastName
    }
}

mutation deleteWorker {
    deleteWorker(id: "60612c7d7785ed6cffc324e7")
}

mutation createEmployer {
    createEmployer(firstName: "kathy", lastName: "tath", email: "xx@gmail.com", password: "aadsfjlkjddfh") {
        firstName
        lastName
    }
}

mutation updateEmployer {
    updateEmployer(id: "6061165a0d961836a6d8ed8d", firstName: "JaROODDDD") {
        firstName
        lastName
    }
}

mutation deleteEmployer {
    deleteEmployer(id: "6061362f44ded6733366191c")
}

mutation createJob {
    createJob(employerId: "6061165a0d961836a6d8ed8d", location: {latitude: 42.0308, longitude: 93.6319}, description: "A very tough job.", desiredSkills: [{name: "Java", rating: 5}]) {
        id
        employer {
            firstName
            lastName
        }
        description
        desiredSkills {
            name
            rating
        }
    }
}

mutation updateJob {
    updateJob(id: "6061165a0d961836a6d8ed8e", description: "actually it's a pretty easy job.") {
        id
        description
    }
}

mutation deleteJob {
    deleteJob(id: "6061407bcbf6a0025d8630f8")
}
```