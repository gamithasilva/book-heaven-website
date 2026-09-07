package lk.ijse.book_web.service.custom;

import lk.ijse.book_web.dto.LoginRequest;
import lk.ijse.book_web.dto.RegisterRequest;
import lk.ijse.book_web.dto.UserDTO;
import lk.ijse.book_web.dto.UserDataDTO;
import lk.ijse.book_web.entity.Customer;
import lk.ijse.book_web.entity.Manager;
import lk.ijse.book_web.enumuration.AccountStatus;
import lk.ijse.book_web.repository.CustomerRepository;
import lk.ijse.book_web.repository.ManagerRepository;
import lk.ijse.book_web.security.JwtUtil;
import lk.ijse.book_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final CustomerRepository customerRepository;

    private final ManagerRepository managerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final AuthenticationManager authenticationManager;

    @Override
    public UserDataDTO login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        String role =
                authentication.getAuthorities()
                        .stream()
                        .findFirst()
                        .map(GrantedAuthority::getAuthority)
                        .orElse("");

        role = role.replace("ROLE_", "");

        if (role.equals("CUSTOMER")) {

            Customer customer =
                    customerRepository
                            .findByEmail(request.getEmail())
                            .orElseThrow();

            UserDTO userDTO =
                    new UserDTO(
                            customer.getId(),
                            customer.getEmail(),
                            customer.getPassword(),
                            "CUSTOMER"
                    );

            String token =
                    jwtUtil.generateToken(userDTO);

            return new UserDataDTO(
                    customer.getId(),
                    token,
                    customer.getEmail(),
                    "CUSTOMER"
            );
        }

        if (role.equals("MANAGER")) {

            Manager manager =
                    managerRepository
                            .findByEmail(request.getEmail())
                            .orElseThrow();

            UserDTO userDTO =
                    new UserDTO(
                            manager.getId(),
                            manager.getEmail(),
                            manager.getPassword(),
                            "MANAGER"
                    );

            String token =
                    jwtUtil.generateToken(userDTO);

            return new UserDataDTO(
                    manager.getId(),
                    token,
                    manager.getEmail(),
                    "MANAGER"
            );
        }

        throw new RuntimeException("Invalid user role");
    }

    @Override
    public UserDataDTO register(RegisterRequest request) {

        if (customerRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        if (managerRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        Customer customer =
                Customer.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .phone(request.getPhone())
                        .status(AccountStatus.ACTIVE)
                        .build();

        customerRepository.save(customer);

        return login(
                new LoginRequest(
                        request.getEmail(),
                        request.getPassword()
                )
        );
    }
}