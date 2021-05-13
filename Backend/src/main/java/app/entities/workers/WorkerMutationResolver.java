package app.entities.workers;

import app.entities.common.Location;
import app.entities.common.Skill;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class WorkerMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WorkerRepository workerRepository;

    private List<Skill> skillListInputToList(List<Skill.SkillInput> skillInputList) {
        List<Skill> skillList = new ArrayList<>();
        skillInputList.forEach((x) -> skillList.add(x.toSkill()));
        return skillList;
    }

    public Worker createWorker(String firstName, String lastName, String email, String password, List<Skill.SkillInput> skillList, Optional<Location.LocationInput> locationInput) {
        if (skillList != null) {
            List<Skill> skillList1 = skillListInputToList(skillList);
            Worker worker = new Worker(firstName, lastName, email, passwordEncoder.encode(password), skillList1);
            locationInput.ifPresent(x->worker.setLocation(x.toLocation()));
            return workerRepository.save(worker);
        }
        Worker worker = new Worker(firstName, lastName, email, passwordEncoder.encode(password));
        locationInput.ifPresent(x->worker.setLocation(x.toLocation()));
        return workerRepository.save(worker);
    }

    public Worker updateWorker(String id, Optional<String> firstName, Optional<String> lastName, Optional<String> email, Optional<String> password, List<Skill.SkillInput> skillList, Optional<Location.LocationInput> locationInput) {
        Optional<Worker> workerOptional = workerRepository.findById(id);
        try {
            Worker worker = workerOptional.get();

            firstName.ifPresent(worker::setFirstName);
            lastName.ifPresent(worker::setLastName);
            email.ifPresent(worker::setEmail);
            password.ifPresent(p -> worker.setPassword(passwordEncoder.encode(p)));
            if (skillList != null) {
                worker.setSkills(skillListInputToList(skillList));
            }

            locationInput.ifPresent(x -> worker.setLocation(x.toLocation()));
            workerRepository.save(worker);
            return worker;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    public Boolean deleteWorker(String workerId) {
        try {
            workerRepository.delete(workerRepository.findById(workerId).get());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
