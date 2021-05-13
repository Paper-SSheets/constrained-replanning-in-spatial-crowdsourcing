package app.entities.workers;

import app.entities.common.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends MongoRepository<Worker, String> {

    public Worker findByFirstName(String firstName);

    public List<Worker> findByLastName(String lastName);

    public Optional<Worker> findById(String id);

    public Optional<Worker> findByEmail(String email);

    public List<Worker> findByLocation(Location location);

}
