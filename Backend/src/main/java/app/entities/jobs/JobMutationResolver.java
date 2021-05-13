package app.entities.jobs;

import app.entities.common.Location;
import app.entities.common.Skill;
import app.entities.employers.Employer;
import app.entities.employers.EmployerRepository;
import app.entities.workers.Worker;
import app.entities.workers.WorkerRepository;
import app.utilities.GoogleMapsAPIService;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class JobMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private GoogleMapsAPIService googleMapsAPIService;

    private List<Skill> skillListInputToList(List<Skill.SkillInput> skillInputList) {
        List<Skill> skillList = new ArrayList<>();
        if (skillInputList == null) {
            return skillList;
        }

        skillInputList.forEach((x) -> skillList.add(x.toSkill()));
        return skillList;
    }

    public Job createJob(String employerId, Optional<String> workerId, Location.LocationInput locationInput, String description, List<Skill.SkillInput> skillInputList) {
        try {
            Employer employer = employerRepository.findById(employerId).get();
            Worker worker = null;
            if (workerId.isPresent()) {
                worker = workerRepository.findById(workerId.get()).get();
            }
            Job job = new Job(employer, worker, locationInput.toLocation(), description, skillListInputToList(skillInputList));
            return jobRepository.save(job);
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    public Job updateJob(String id, Optional<String> employerId, Optional<String> workerId, Optional<Location.LocationInput> locationInput, Optional<String> description, List<Skill.SkillInput> skillInputList) {
        Optional<Worker> workerOptional = workerRepository.findById(id);
        try {
            Job job = jobRepository.findById(id).get();

            workerId.ifPresent(s -> job.setWorker(workerRepository.findById(s).get()));
            employerId.ifPresent(s -> job.setEmployer(employerRepository.findById(s).get()));

            locationInput.ifPresent(j -> job.setLocation(j.toLocation()));
            description.ifPresent(job::setDescription);
            if (skillInputList != null) {
                job.setDesiredSkills(skillListInputToList(skillInputList));
            }
            return jobRepository.save(job);
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    public Boolean deleteJob(String jobId) {
        try {
            jobRepository.delete(jobRepository.findById(jobId).get());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Worker> requestWorkersPrioritizeMinimumDistanceTraveled(String jobId) {
        List<Worker> toReturn = new ArrayList<>();
        Optional<Job> jobOptional = jobRepository.findById(jobId);

        if (!jobOptional.isPresent()) {
            return toReturn;
        }
        Job job = jobOptional.get();
        Location jobLocation = job.getLocation();

        List<IdAndDistance> idAndDistanceList = new ArrayList<>();

        for (Worker worker : workerRepository.findAll()) {
            idAndDistanceList.add(new IdAndDistance(worker.getId(), googleMapsAPIService.getDistanceBetweenTwoCoordinates(worker.getLocation(), jobLocation)));
        }

        Collections.sort(idAndDistanceList);
        if (idAndDistanceList.size() > 5) {
            idAndDistanceList = idAndDistanceList.subList(0, 5);
        }
        idAndDistanceList.forEach(t -> toReturn.add(workerRepository.findById(t.id).get()));
        return toReturn;
    }

    public List<Worker> requestWorkersPrioritizeFastestTimeToCompleteJob(String jobId) {
        List<Worker> toReturn = new ArrayList<>();
        Optional<Job> jobOptional = jobRepository.findById(jobId);

        if (!jobOptional.isPresent()) {
            return toReturn;
        }
        Job job = jobOptional.get();
        Location jobLocation = job.getLocation();

        List<IdAndDistance> idAndDistanceList = new ArrayList<>();

        for (Worker worker : workerRepository.findAll()) {
            Double distance = 0.0;
            if (worker.getCurrentJob() != null) {
                distance += worker.getCurrentJob().getEstimatedTimeTillCompletion();
                distance += googleMapsAPIService.getDistanceBetweenTwoCoordinates(worker.getCurrentJob().getLocation(), jobLocation);
            } else {
                distance = googleMapsAPIService.getDistanceBetweenTwoCoordinates(worker.getLocation(), jobLocation);
            }
            IdAndDistance workerIdAndDistance = new IdAndDistance(worker.getId(), distance);
            idAndDistanceList.add(workerIdAndDistance);
        }

        Collections.sort(idAndDistanceList);
        if (idAndDistanceList.size() > 5) {
            idAndDistanceList = idAndDistanceList.subList(0, 5);
        }
        idAndDistanceList.forEach(t -> toReturn.add(workerRepository.findById(t.id).get()));
        return toReturn;
    }


    public Worker acceptJob(String workerID, String jobID) {
        Worker worker = workerRepository.findById(workerID).get();
        Job job = jobRepository.findById(jobID).get();
        worker.setCurrentJob(job);
        workerRepository.save(worker);
        job.setStatus(Job.Status.IN_PROGRESS);
        job.setWorker(worker);
        // job.setEstimatedTimeTillCompletion();
        jobRepository.save(job);
        return worker;
    }

    public Worker completeJob(String workerID, String jobID) {
        Worker worker = workerRepository.findById(workerID).get();
        Job job = jobRepository.findById(jobID).get();
        worker.setCurrentJob(null);
        workerRepository.save(worker);
        job.setStatus(Job.Status.COMPLETED);
        jobRepository.save(job);
        return worker;
    }

    private static class IdAndDistance implements Comparable {
        private String id;
        private Double distance;

        public IdAndDistance(String id, Double distance) {
            this.id = id;
            this.distance = distance;
        }

        @Override
        public int compareTo(@NotNull Object o) {
            IdAndDistance idAndDistance = (IdAndDistance) o;
            return this.distance.compareTo(idAndDistance.distance);
        }
    }
}
