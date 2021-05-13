package app.entities.jobs;

import app.entities.common.Location;
import app.entities.common.Skill;
import app.entities.employers.Employer;
import app.entities.workers.Worker;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "jobs")
public class Job {
    @Id
    private String id;

    @DBRef
    private Employer employer;
    @DBRef
    private Worker worker;

    private Location location;
    private String description;
    private List<Skill> desiredSkills;
    private int estimatedTimeTillCompletion;
    private Status status;

    public Job(Employer employer, Worker worker, Location location, String description, List<Skill> desiredSkills) {
        this.employer = employer;
        this.worker = worker;
        this.location = location;
        this.description = description;
        this.desiredSkills = desiredSkills;
        this.status = Status.LOOKING_FOR_WORKER;
    }

    @Override
    public String toString() {
        return String.format(
                "app.entities.employers.Job[id=%s, employer=%s, worker=%s, location=%s, " +
                        "description=%s, desiredSkills=%s]", id, employer, worker, location, description, desiredSkills);
    }

    public Employer getEmployer() {
        return employer;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Skill> getDesiredSkills() {
        return desiredSkills;
    }

    public void setDesiredSkills(List<Skill> desiredSkills) {
        this.desiredSkills = desiredSkills;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getEstimatedTimeTillCompletion() {
        return estimatedTimeTillCompletion;
    }

    public void setEstimatedTimeTillCompletion(int estimatedTimeTillCompletion) {
        this.estimatedTimeTillCompletion = estimatedTimeTillCompletion;
    }

    public enum Status {
        LOOKING_FOR_WORKER,
        IN_PROGRESS,
        COMPLETED
    }
}