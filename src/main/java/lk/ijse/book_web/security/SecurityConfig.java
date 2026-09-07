package lk.ijse.book_web.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .csrf(csrf ->
                        csrf.disable()
                )

                .authorizeHttpRequests(auth ->
                        auth

                                // Authentication
                                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                                // Public book browsing
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/v1/books/**"
                                ).permitAll()

                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/v1/category/**"
                                ).permitAll()

                                .requestMatchers("/api/auth/me").authenticated()

                                // Customer
                                .requestMatchers(
                                        "/api/customer/**"
                                ).hasRole("CUSTOMER")

                                // Manager
                                .requestMatchers(
                                        "/api/manager/**"
                                ).hasRole("MANAGER")

                                // AI
                                .requestMatchers(
                                        "/api/v1/ai/**"
                                ).hasAnyRole(
                                        "CUSTOMER",
                                        "MANAGER"
                                )

                                // Everything else
                                .anyRequest().permitAll()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        authProvider.setPasswordEncoder(
                passwordEncoder()
        );

        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList("*")
        );

        configuration.setAllowedMethods(
                Arrays.asList("*")
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setExposedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type"
                )
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

}
