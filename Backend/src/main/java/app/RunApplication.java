package app;

import app.entities.customers.CustomerRepository;
import app.entities.jobs.JobRepository;
import app.entities.workers.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication()
@CrossOrigin
public class RunApplication implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WorkerRepository workerRepository;

//    @Autowired
//    private EmployerRepository employerRepository;

    @Autowired
    private JobRepository jobRepository;


    public static void main(String[] args) {
        SpringApplication.run(RunApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
/*
        System.out.println("REEEEEEEEEEEEEEEEEEEEEEEEEEE: " + passwordEncoder);
        CustomQueryRepository customQueryRepository = new CustomQueryRepository(jobRepository, employerRepository, workerRepository);

        customerRepository.deleteAll();
        workerRepository.deleteAll();
        employerRepository.deleteAll();
        jobRepository.deleteAll();

//        List<User> employerList = employerRepository.findByFirstName("Jared");
//        System.out.println(employerList);
//
//        System.out.println(jobRepository.findByPoster(employerList.get(0)));


        List<Skill> sl1 = Arrays.asList(
                new Skill("Java", 5),
                new Skill("C", 4));
        List<Skill> sl2 = Arrays.asList(
                new Skill("Java", 3),
                new Skill("C", 3));
        Location l1 = new Location(42.022160, -93.642873);
        Location l2 = new Location(42.03, -93.65);

        Worker w1 = new Worker("Steven", "Sheets", "smsheets@iastate.edu", passwordEncoder.encode("password369"), sl1, l1);
        workerRepository.save(w1);

        Employer e1 = new Employer("Jared", "Weiland", "jweiland@iastate.edu", passwordEncoder.encode("password123"));
        employerRepository.save(e1);

        Job j1 = new Job(e1, w1, l2, "Test job", sl2);
        jobRepository.save(j1);


        //System.out.println(customQueryRepository.findWorkersByDesiredSkills(new ArrayList<>(Arrays.asList(new Skill("Java",3.0)))));

        System.out.println(customQueryRepository.findJobsByDesiredSkills(new ArrayList<>(Arrays.asList(new Skill("Java", 2.0)))));

        /*
        // save a couple of customers
        customerRepository.save(new Customer("Alice", "Smith"));
        customerRepository.save(new Customer("Bob", "Smith"));

        // fetch all customers
        /*
        System.out.println("Customers found with findAll():");
        System.out.println("-------------------------------");
        for (Customer customer : customerRepository.findAll()) {
            System.out.println(customer);
        }
        System.out.println();

        // fetch an individual customer
        System.out.println("app.entities.customers.Customer found with findByFirstName('Alice'):");
        System.out.println("--------------------------------");
        System.out.println(customerRepository.findByFirstName("Alice"));

        System.out.println("Customers found with findByLastName('Smith'):");
        System.out.println("--------------------------------");
        for (Customer customer : customerRepository.findByLastName("Smith")) {
            System.out.println(customer);
        }
*/
    }

}
