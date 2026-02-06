package com.bengregory.notes.service;

import com.bengregory.notes.dto.UserDTO;
import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/*
    Service class to handle user-related operations for admin functionalities.
    Provides methods to retrieve all users, update user roles, and get user details by ID.
 */
@Service
public class UserService implements IUserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Retrieve all users from the database
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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
}
