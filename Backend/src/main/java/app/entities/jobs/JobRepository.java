package app.entities.jobs;

import app.entities.employers.Employer;
import app.entities.workers.Worker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    public List<Job> findAll();

    public List<Job> findByEmployer(Employer employer);

    public List<Job> findJobsById(String employerId);

    public List<Job> findByWorker(Worker worker);
    
}

