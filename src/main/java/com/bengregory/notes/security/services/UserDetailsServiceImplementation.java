package com.bengregory.notes.security.services;

import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*
    Spring Security uses this class to load user-specific data during authentication. 
    It implements the UserDetailsService interface, which has a single method loadUserByUsername.
    This method is called by Spring Security to retrieve user details (like username, password, and authorities) from the database or any other user store.
 */

@Service
public class UserDetailsServiceImplementation implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    // Load a user by their username during the authentication process.
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username).orElseThrow(() ->
            new UsernameNotFoundException("Unable to retrieve user: " + username));
        
        // Return a UserDetails object that Spring Security can use to perform authentication and authorization checks.
        return UserDetailsImplementation.build(user);
    }
}
