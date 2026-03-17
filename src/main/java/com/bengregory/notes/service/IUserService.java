package com.bengregory.notes.service;

import com.bengregory.notes.dto.UserDTO;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import java.util.List;


public interface IUserService {

    List<User> getAllUsers();

    List<Role> getAllRoles();

    void updateUserRole(Long userId, String roleName);

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    void updateAccountLockStatus(Long userId, boolean lock);

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);

    void updatePassword(Long userId, String password);

    void generatePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);
}
