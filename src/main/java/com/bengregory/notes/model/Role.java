package com.bengregory.notes.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor  // Lombok annotation to generate a no-argument constructor
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as parameters
@Data               // Lombok annotation to generate getters, setters, toString, equals, and hashCode methods
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;

    // Exclude from toString to prevent potential recursion issues
    @ToString.Exclude
    // Store the enum as a string in the database
    @Enumerated(EnumType.STRING)
    @Column(length = 20, name = "role_name")
    private AppRole roleName;


    // Bi-directional mapping, so that we can see which users have this role
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    // Prevent infinite recursion during JSON serialization
    @ToString.Exclude
    @JsonBackReference
    private Set<User> users = new HashSet<>();

    public Role(AppRole roleName){
        this.roleName = roleName;
    }
}
