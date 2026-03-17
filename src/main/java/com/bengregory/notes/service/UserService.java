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
    Service class to handle user-related operations for admin functionalities.
    Provides methods to retrieve all users, update user roles, and get user details by ID.
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
    public User findByUsername(String username){
        Optional<User> user = userRepository.findByUserName(username);
        return user.orElseThrow(() -> new RuntimeException("Unable to find user with " + username));
    }

    @Override
    public void updateAccountLockStatus(Long userId, boolean lock){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setAccountNonLocked(!lock);
        userRepository.save(user);
    }

    @Override
    public void updateAccountExpiryStatus(Long userId, boolean expire){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setAccountNonExpired(!expire);
        userRepository.save(user);
    }

    @Override
    public void updateAccountEnabledStatus(Long userId, boolean enabled){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setEnabled(!enabled);
        userRepository.save(user);
    }

    @Override
    public void updateCredentialsExpiryStatus(Long userId, boolean expire){
        User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!")
        );
        user.setCredentialsNonExpired(!expire);
        userRepository.save(user);
    }

    @Override
    public void updatePassword(Long userId, String password){
        try{
            User user = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("Unable to find User!"));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to update password!");
        }
    }

    @Override
    public void generatePasswordResetToken(String email){
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new RuntimeException("Unable to find User!"));

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(1, ChronoUnit.HOURS);
        PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        // Send email to the user
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    @Override
    public void resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if(resetToken.isUsed())
            throw new RuntimeException("Password reset token was already used!");

        if(resetToken.getExpiryDate().isBefore(Instant.now()))
            throw new RuntimeException("Password Reset token is expired!");

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
