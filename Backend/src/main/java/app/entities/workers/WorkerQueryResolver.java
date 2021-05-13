package app.entities.workers;

import app.entities.common.Location;
import app.entities.common.Skill;
import app.entities.jobs.Job;
import app.entities.jobs.JobRepository;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class WorkerQueryResolver implements GraphQLQueryResolver {

    @Autowired
    public WorkerRepository workerRepository;

    @Autowired
    public JobRepository jobRepository;

    public List<Worker> getWorkers() {
        return workerRepository.findAll();
    }

    public List<Worker> getWorkersByEmail(String email) {
        return workerRepository.findAll().stream().filter(employer -> employer.getEmail().equals(email)).collect(Collectors.toList());
    }

    public Worker findByFirstName(String firstName) {
        return workerRepository.findByFirstName(firstName);
    }

    public List<Worker> findByLastName(String lastName) {
        return workerRepository.findByLastName(lastName);
    }

    public Optional<Worker> findById(String id) {
        return workerRepository.findById(id);
    }

    public List<Worker> findByLocation(Location location){
        return workerRepository.findByLocation(location);
    }

    public List<Worker> findWorkersByDesiredSkills(List<Skill> desiredSkills) {

        List<Job> allJobs = jobRepository.findAll();
        List<Worker> allWorkers = workerRepository.findAll();

        List<Worker> output = new ArrayList<>();

        for (Worker worker : allWorkers) {
            List<Skill> workerSkills = worker.getSkills();
            int skillsSatisfied = 0;

            for (Skill workerSkill : workerSkills) {
                for (Skill desiredSkill : desiredSkills) {
                    if (workerSkill.getName().equals(desiredSkill.getName()) && workerSkill.getRating() >= desiredSkill.getRating()) {
                        skillsSatisfied++;
                    }
                }
            }
            if (skillsSatisfied == desiredSkills.size()) {
                output.add(worker);
            }
        }
        return output;
    }


}
