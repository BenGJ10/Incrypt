package com.bengregory.notes.controller;

import com.bengregory.notes.security.jwt.JWTUtils;
import com.bengregory.notes.security.request.LoginRequest;

import com.bengregory.notes.security.response.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authManager;

    // Method for handling user authentication requests
    @PostMapping("/public/signin")
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

}
