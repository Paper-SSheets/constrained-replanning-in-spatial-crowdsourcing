package app.entities.jobs;

import app.entities.common.Skill;
import app.entities.employers.Employer;
import app.entities.workers.Worker;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JobQueryResolver implements GraphQLQueryResolver {

    @Autowired
    public JobRepository jobRepository;

    public List<Job> getJobsByEmployerId(String employerId) {
        List<Job> allJobs = jobRepository.findAll();
        List<Job> output = new ArrayList<>();

        for (Job job : allJobs) {
            if (job.getEmployer().getId().equals(employerId)) {
                output.add(job);
            }
        }
        return output;
    }

    public List<Job> getJobsByEmployer(Employer employer) {
        return jobRepository.findByEmployer(employer);
    }

    public List<Job> findByWorker(Worker worker) {
        return jobRepository.findByWorker(worker);
    }

    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    public List<Job> findJobsByDesiredSkills(List<Skill> desiredSkills) {
        List<Job> allJobs = jobRepository.findAll();
        List<Job> output = new ArrayList<>();

        for (Job job : allJobs) {
            List<Skill> jobSkills = job.getDesiredSkills();
            int skillsSatisfied = 0;

            for (Skill jobSkill : jobSkills) {
                for (Skill desiredSkill : desiredSkills) {
                    if (jobSkill.getName().equals(desiredSkill.getName()) && jobSkill.getRating() >= desiredSkill.getRating()) {
                        skillsSatisfied++;
                    }
                }
            }
            if (skillsSatisfied == desiredSkills.size()) {
                output.add(job);
            }
        }
        return output;
    }
}
