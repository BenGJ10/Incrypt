package com.bengregory.notes.controller;

import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.repository.UserRepository;
import com.bengregory.notes.security.jwt.JWTUtils;
import com.bengregory.notes.security.request.ContactRequest;
import com.bengregory.notes.security.request.LoginRequest;

import com.bengregory.notes.security.request.SignupRequest;
import com.bengregory.notes.security.response.LoginResponse;
import com.bengregory.notes.security.response.MessageResponse;
import com.bengregory.notes.security.response.UserInfoResponse;
import com.bengregory.notes.security.services.UserDetailsImplementation;
import com.bengregory.notes.service.TotpService;
import com.bengregory.notes.service.UserService;
import com.bengregory.notes.utils.AuthUtils;
import com.bengregory.notes.utils.EmailService;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private TotpService totpService;

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
        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();

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

    // Method for retrieving the details of the currently authenticated user
    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) { // AuthenticationPrincipal will automatically inject the currently authenticated user's details into the method parameter
        User user = userService.findByUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse userInfoResponse = new UserInfoResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.isTwoFactorEnabled(),
                roles
        );
        return ResponseEntity.ok().body(userInfoResponse);
    }

    @GetMapping("/username")
    public String getUsername(@AuthenticationPrincipal UserDetails userDetails){
        return (userDetails != null) ? userDetails.getUsername() : "";
    }

    @PostMapping("/update-credentials")
    public ResponseEntity<?> updateCredentials(@RequestParam String newUsername,
                                               @RequestParam(required = false) String newPassword,
                                               @RequestParam(required = false) String token) {
        try {
            Long userId = authUtils.loggedInUserId();
            userService.updateUserCredentials(userId, newUsername, newPassword);
            return ResponseEntity.ok(new MessageResponse("Credentials updated successfully. Please log in again if username changed."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }


    // Method for handling password reset requests when a user forgets their password
    // It generates a password reset token and sends it to the user's email address
    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){
        try{
            userService.generatePasswordResetToken(email);
            return ResponseEntity.ok(new MessageResponse("Password reset token sent successfully..."));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new MessageResponse("Error sending password reset token!"));
        }
    }

    // Method for handling password reset requests when a user has received a password reset token and wants to set a new password
    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword){
        try{
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok(new MessageResponse("Password reset completed."));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new MessageResponse("Couldn't reset password!"));
        }
    }

    // Method for handling contact requests from users who want to send a message to the support team or administrators of the application
    @PostMapping("/public/contact")
    public ResponseEntity<?> contactTeam(@Valid @RequestBody ContactRequest contactRequest) { // Valid annotation ensures that the incoming contact request is validated according to the constraints defined in the ContactRequest class
        try {
            // Using the EmailService to send the contact message to the support team or administrators
            emailService.sendContactMessage(contactRequest.getName(), contactRequest.getEmail(), contactRequest.getMessage());
            return ResponseEntity.ok(new MessageResponse("Your message has been sent successfully."));
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error sending your message. Please try again later."));
        }
    }

    // Method for enabling Two-Factor Authentication (2FA) for the currently authenticated user
    // It generates a secret key for 2FA and returns a QR code URL that the user can scan with an authenticator app to set up 2FA on their account
    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA(){
        Long userId = authUtils.loggedInUserId();
        
        // Generating a secret key for 2FA using the UserService and then generating a QR code URL using the TotpService
        // The QR code URL can be scanned by the user with an authenticator app (like Google Authenticator) to set up 2FA on their account
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);
        String qrCodeURL = totpService.getQRCodeUrl(secret, userService.getUserById(userId).getUserName());
        
        return ResponseEntity.ok(qrCodeURL);
    }

    // Method for disabling Two-Factor Authentication (2FA) for the currently authenticated user
    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA(){
        Long userId = authUtils.loggedInUserId();
        userService.disable2FA(userId);
        return ResponseEntity.ok("2FA Disabled!");
    }

    // Method for verifying the 2FA code entered by the user during the 2FA setup process
    @PostMapping("verify-2fa")
    public ResponseEntity<String> verify2fa(@RequestParam int code){
        Long userId = authUtils.loggedInUserId();
        
        // Validating the 2FA code entered by the user using the UserService. If the code is valid, 2FA will be enabled for the user's account
        boolean isValid= userService.validate2FACode(userId, code);
        if(isValid){
            userService.enable2FA(userId);
            return ResponseEntity.ok("2FA verified.");
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid 2FA code!");
    }

    // Method for retrieving the current 2FA status of the authenticated user, indicating whether 2FA is enabled or not
    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FAStatus() {
        User user = authUtils.loggedInUser();
        if(user != null){
            boolean enabled = user.isTwoFactorEnabled();
            return ResponseEntity.ok().body(Map.of(
                    "is2faEnabled", enabled,
                    "is2FAEnabled", enabled
            ));
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }   

    // Method for verifying the 2FA code entered by the user during the login process. It takes the 2FA code and the 
    // JWT token generated during login as input, validates the 2FA code, and returns a response indicating whether the 2FA verification was successful or not
    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(@RequestParam int code, @RequestParam String jwtToken){        
        
        // Using jwtUtils instead of authUtils to extract the username from the JWT token, since the user is not fully authenticated yet and we cannot rely on the security context to provide the user details
        String username = jwtUtils.getUsernameFromToken(jwtToken);
        
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);

        if(isValid){
            return ResponseEntity.ok("2FA Verified!");
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid 2FA code!");
        }
    }

}
