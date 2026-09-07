package lk.ijse.book_web.security;

import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.entity.Manager;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.repository.ManagerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final ManagerRepository managerRepository;


    public CustomUserDetailService(CustomerRepository customerRepository, ManagerRepository managerRepository) {
        this.customerRepository = customerRepository;
        this.managerRepository = managerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(username).orElse(null);

        if (customer != null) {
            return User.builder()
                    .username(customer.getEmail())
                    .password(customer.getPassword())
                    .roles("CUSTOMER")
                    .build();
        }

        Manager manager = managerRepository.findByEmail(username).orElse(null);
        if (manager != null) {
            return User.builder()
                    .username(manager.getEmail())
                    .password(manager.getPassword())
                    .roles("MANAGER")
                    .build();
        }
        throw  new UsernameNotFoundException("Invalid not found with email: " + username);
    }
}
