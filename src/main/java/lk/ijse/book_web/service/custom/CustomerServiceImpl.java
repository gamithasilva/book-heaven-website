package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.ChangePasswordDTO;
import lk.ijse.book_web.dto.CustomerDTO;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor

@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return convertToDTO(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerByEmail(String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return convertToDTO(customer);
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setPhone(customerDTO.getPhone());
        customer.setUpdatedAt(java.time.LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);

        return convertToDTO(updatedCustomer);
    }

    @Override
    public void changePassword(
            String email,
            ChangePasswordDTO changePasswordDTO) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check current password
        if (!passwordEncoder.matches(
                changePasswordDTO.getCurrentPassword(),
                customer.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

        // Check new password confirmation
        if (!changePasswordDTO.getNewPassword()
                .equals(changePasswordDTO.getConfirmPassword())) {

            throw new RuntimeException("New passwords do not match");
        }

        // Save encrypted password
        customer.setPassword(
                passwordEncoder.encode(
                        changePasswordDTO.getNewPassword()
                )
        );

        customer.setUpdatedAt(java.time.LocalDateTime.now());

        customerRepository.save(customer);
    }

    @Override
    public CustomerDTO updateProfileImage(
            String email,
            String profileImage) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setProfileImage(profileImage);
        customer.setUpdatedAt(java.time.LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);

        return convertToDTO(updatedCustomer);
    }

    private CustomerDTO convertToDTO(Customer customer) {

        return CustomerDTO.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .profileImage(customer.getProfileImage())
                .status(customer.getStatus())
                .build();
    }
}