package com.bengregory.notes.security;

import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.repository.UserRepository;
import com.bengregory.notes.security.jwt.AuthEntryPoint;
import com.bengregory.notes.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import java.time.LocalDate;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security support and provides the Spring MVC integration
@EnableMethodSecurity(
        prePostEnabled = true, // Enable pre/post annotations 
        securedEnabled = true, // Enable @Secured annotation support
        jsr250Enabled = true)  // Enable JSR-250 annotations like @RolesAllowed
public class SecurityConfig {

    @Autowired // Handle unauthorized access attempts by sending an appropriate response (e.g., 401 Unauthorized)
    private AuthEntryPoint unauthorizationHandler;

    @Bean // Bean for the authentication token filter that processes JWT tokens in incoming requests
    public AuthTokenFilter authenticationJWTTokenFilter(){
        return new AuthTokenFilter();
    }

    @Bean // Bean for configuring the security filter chain that defines how HTTP requests are secured
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception { 
        http.csrf(
                csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        );
        http.authorizeHttpRequests((requests) -> requests // Authorize all the requests to be authenticated
                //.requestMatchers("/api/admin/**").hasRole("ADMIN") // OPTIONAL: Only users with ADMIN role can access this endpoint
                  .requestMatchers("/api/csrf-token").permitAll()
                  .requestMatchers("/api/auth/public/**").permitAll() // Allow public endpoints without authentication
                  .anyRequest().authenticated()); // All other requests require authentication


        // http.csrf(AbstractHttpConfigurer::disable); Disable CSRF
        
        // Default exception handling for unauthorized access
        http.exceptionHandling(exception
                        -> exception.authenticationEntryPoint(unauthorizationHandler));        
        // Add the JWT authentication filter before the username/password authentication filter
        http.addFilterBefore(authenticationJWTTokenFilter(), UsernamePasswordAuthenticationFilter.class);         
        http.httpBasic(withDefaults()); // Use HTTP Basic authentication for simplicity
        return http.build(); // Build and return the SecurityFilterChain
    }

    @Bean // Bean for the AuthenticationManager that is used to authenticate user credentials
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception{
        return authConfiguration.getAuthenticationManager();
    }

    @Bean // Bean for password encoding using BCrypt
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean // CommandLineRunner to initialize default roles and users in the database at application startup
    public CommandLineRunner initData(RoleRepository roleRepository,
                                      UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

            if (!userRepository.existsByUserName("user")) {
                User user1 = new User("user", "user@example.com",
                        passwordEncoder.encode("password"));
                user1.setAccountNonLocked(false);
                user1.setAccountNonExpired(true);
                user1.setCredentialsNonExpired(true);
                user1.setEnabled(true);
                user1.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
                user1.setAccountExpiryDate(LocalDate.now().plusYears(1));
                user1.setTwoFactorEnabled(false);
                user1.setSignUpMethod("email");
                user1.setRole(userRole);
                userRepository.save(user1);
            }

            if (!userRepository.existsByUserName("admin")) {
                User admin = new User("admin", "admin@example.com",
                        passwordEncoder.encode("adminPassword"));
                admin.setAccountNonLocked(true);
                admin.setAccountNonExpired(true);
                admin.setCredentialsNonExpired(true);
                admin.setEnabled(true);
                admin.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
                admin.setAccountExpiryDate(LocalDate.now().plusYears(1));
                admin.setTwoFactorEnabled(false);
                admin.setSignUpMethod("email");
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        };
    }
}
