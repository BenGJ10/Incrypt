package com.bengregory.notes.repository;

import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole roleName);
}
