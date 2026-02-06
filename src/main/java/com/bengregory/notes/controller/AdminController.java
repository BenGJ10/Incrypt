package com.bengregory.notes.controller;

import com.bengregory.notes.dto.UserDTO;
import com.bengregory.notes.model.User;
import com.bengregory.notes.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
    AdminController to manage users and their roles. Only accessible by users with ADMIN role.
    Lets admins view all users, update user roles, and get user details by ID.
 */

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUsers")
    public ResponseEntity<List<User>> getAllUsers(){
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/updateRole")
    public ResponseEntity<String> updateUserRole(
            @RequestParam Long userId, @RequestParam String roleName){
        userService.updateUserRole(userId, roleName);
        return ResponseEntity.ok("User Role updated successfully...");
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id){
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }
}
