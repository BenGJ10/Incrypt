package com.bengregory.notes.service;

import com.bengregory.notes.dto.UserDTO;
import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.PasswordResetToken;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.PasswordResetTokenRepository;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.repository.UserRepository;
import com.bengregory.notes.utils.EmailService;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/*
    Service class to handle user-related operations such as retrieving users, updating roles, managing account status,
    handling password resets, and managing 2FA. Implements IUserService interface for abstraction.
   
 */
@Service
public class UserService implements IUserService{

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TotpService totpService;

    // Retrieve all users from the database
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Retrieve all roles from the database
    @Override
    public List<Role> getAllRoles(){ return roleRepository.findAll(); }

    // Update user role based on user ID and new role name
    @Override
    public void updateUserRole(Long userId, String roleName) {
        
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("Unable to find User!"));
        AppRole appRole = AppRole.valueOf(roleName);
        
        Role role = roleRepository.findByRoleName(appRole).orElseThrow(
                () -> new RuntimeException("Unable to find Role!"));

        user.setRole(role);
    }

    // Get user details by ID and convert to UserDTO for response
    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return convertToDTO(user);
    }

    // Helper method to convert User entity to UserDTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.getTwoFactorSecret(),
                user.isTwoFactorEnabled(),
                user.getSignUpMethod(),
                user.getRole(),
                user.getCreatedDate(),
                user.getUpdatedDate()
        );
    }

    @Override
    // Find user by username, throw exception if not found
    public User findByUsername(String username){
        Optional<User> user = userRepository.findByUserName(username);
        return user.orElseThrow(() -> new RuntimeException("Unable to find user with " + username));
    }

    @Override
    // Find user by email, return Optional to handle case where user may not exist
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    // Update account lock status based on user ID and lock/unlock action
    public void updateAccountLockStatus(Long userId, boolean lock){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setAccountNonLocked(!lock);
        userRepository.save(user);
    }

    @Override
    // Update account lock status based on user ID and lock/unlock action
    public void updateAccountExpiryStatus(Long userId, boolean expire){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setAccountNonExpired(!expire);
        userRepository.save(user);
    }

    @Override
    // Update account enabled status based on user ID and enable/disable action
    public void updateAccountEnabledStatus(Long userId, boolean enabled){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setEnabled(!enabled);
        userRepository.save(user);
    }

    @Override
    // Update credentials expiry status based on user ID and expire/unexpire action
    public void updateCredentialsExpiryStatus(Long userId, boolean expire){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setCredentialsNonExpired(!expire);
        userRepository.save(user);
    }

    @Override
    // Update user password by encoding the new password and saving the user entity
    public void updatePassword(Long userId, String password){
        try{
            User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!"));
            user.setPassword(passwordEncoder.encode(password)); // Always encode the password before saving
            userRepository.save(user);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to update password!");
        }
    }

    @Override
    // Generate a password reset token for the user with the given email and send a reset link via email
    public void generatePasswordResetToken(String email){
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new RuntimeException("Unable to find User!"));
        
        // Generate a unique token and set an expiry time for the token (e.g., 1 hour)
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(1, ChronoUnit.HOURS);
        
        // Create a PasswordResetToken entity and save it to the database
        PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);
        // TODO: Implement a scheduled task to clean up expired tokens from the database
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        // Send email to the user
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    @Override
    // Reset the user's password using the provided token and new password, ensuring the token is valid and not expired
    public void resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        // Check if the token has already been used or is expired before allowing password reset
        if(resetToken.isUsed())
            throw new RuntimeException("Password reset token was already used!");

        if(resetToken.getExpiryDate().isBefore(Instant.now()))
            throw new RuntimeException("Password Reset token is expired!");
        
        // If the token is valid, update the user's password and mark the token as used
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark the token as used to prevent reuse and save the updated token status to the database
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    // Register a new user by encoding the password and saving the user entity to the database
    public User registerUser(User user){
        if (user.getPassword() != null)
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    // Generate a 2FA secret for the user and save it to the user's entity in the database, returning the generated secret key
    public GoogleAuthenticatorKey generate2FASecret(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found!"));
        
        // Generate a new 2FA secret key using the TotpService and save it to the user's entity                
        GoogleAuthenticatorKey key = totpService.generateSecret();
        user.setTwoFactorSecret(key.getKey());
        
        userRepository.save(user);
        return key;
    }

    @Override
    // Validate the provided 2FA code against the user's stored 2FA secret, returning true if the code is valid and false otherwise
    public boolean validate2FACode(Long userId, int code){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found!"));
        return totpService.verifyCode(user.getTwoFactorSecret(), code);
    }

    @Override
    // Enable 2FA for the user by setting the twoFactorEnabled flag to true in the user's entity 
    public void enable2FA(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found!"));
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Override
    // Disable 2FA for the user by setting the twoFactorEnabled flag to false in the user's entity 
    public void disable2FA(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found!"));
        user.setTwoFactorEnabled(false);
        userRepository.save(user);
    }
}
