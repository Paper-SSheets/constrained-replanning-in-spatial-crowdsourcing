package app.entities.employers;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployerRepository extends MongoRepository<Employer, String> {

    public List<Employer> findByFirstName(String firstName);

    public List<Employer> findByLastName(String lastName);

    public List<Employer> findByEmail(String email);
}

