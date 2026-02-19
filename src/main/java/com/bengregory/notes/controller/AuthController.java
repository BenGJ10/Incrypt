package com.bengregory.notes.controller;

import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.repository.UserRepository;
import com.bengregory.notes.security.jwt.JWTUtils;
import com.bengregory.notes.security.request.LoginRequest;

import com.bengregory.notes.security.request.SignupRequest;
import com.bengregory.notes.security.response.LoginResponse;
import com.bengregory.notes.security.response.MessageResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Method for handling user authentication requests
    @PostMapping("/public/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        // Attempt to authenticate the user using the provided username and password
        try {
            authentication = authManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } 
        // If authentication fails, an AuthenticationException will be thrown 
        catch (AuthenticationException e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad Credentials");
            map.put("status", "false");
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }
        
        // Setting the authentication to establish the auth for the session
        // Marks the current user as authenticated in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Retrieving the authenticated user's details from the authentication object
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generating a JWT token for the authenticated user using their username
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        // Extracting the roles of the authenticated user and collecting them into a list of strings
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority()) // Mapping each authority to its string representation
                .collect(Collectors.toList()); 
        
        // LoginResponse obj contains the JWT token, username, and roles of the authenticated user
        LoginResponse response = new LoginResponse(jwtToken, userDetails.getUsername(), roles);
        
        return ResponseEntity.ok(response);
    }

    // Method for handling user registration requests
    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest){
        
        // Checking if the username or email provided in the signup request already exists in the database
        if(userRepository.existsByUserName(signupRequest.getUsername())){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if(userRepository.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new User account
        User user = new User(signupRequest.getUsername(), signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword())); // Encoding the password

        Set<String> strRoles = signupRequest.getRole();
        Role role;

        // If no roles are specified in the signup request, assign the default role of ROLE_USER to the new user
        if(strRoles == null || strRoles.isEmpty()){
            role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found!"));
        }
        else{
            String roleStr = strRoles.iterator().next();
            if(roleStr.equals("admin")){
                role = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role not found!"));
            }
            else{
                role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role not found!"));
            }
            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user.setTwoFactorEnabled(false);
            user.setSignUpMethod("email");
        }
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
// we use custom MessageResponse class to send a response message back to the client, indicating the success or failure of the registration process.
// why we use custom MessageResponse class instead of just returning a string message?

