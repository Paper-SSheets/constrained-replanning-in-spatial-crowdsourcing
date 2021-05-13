package app.entities.employers;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EmployerMutationResolver implements GraphQLMutationResolver {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployerRepository employerRepository;

    public Employer createEmployer(String firstName, String lastName, String email, String password) {
        Employer employer = new Employer(firstName, lastName, email, passwordEncoder.encode(password));
        return employerRepository.save(employer);
    }

    public Employer updateEmployer(String id, Optional<String> firstName, Optional<String> lastName, Optional<String> email, Optional<String> password) {
        Optional<Employer> employerOptional = employerRepository.findById(id);
        try {
            Employer employer = employerOptional.get();

            firstName.ifPresent(employer::setFirstName);
            lastName.ifPresent(employer::setLastName);
            email.ifPresent(employer::setEmail);
            password.ifPresent(p -> employer.setPassword(passwordEncoder.encode(p)));

            employerRepository.save(employer);
            return employer;
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    public Boolean deleteEmployer(String employerId) {
        try {
            employerRepository.delete(employerRepository.findById(employerId).get());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
