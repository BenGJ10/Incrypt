package com.bengregory.notes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Token should be unique and not null to ensure we can identify the correct reset request
    @Column(nullable = false, unique = true)
    private String token;

    // Instant gives us a timestamp in nanoseconds, which is more precise than Date
    @Column(nullable = false)
    private Instant expiryDate;

    // User relationship to link the token to a specific user. FetchType.LAZY to avoid loading user data unless
    // necessary, which can improve performance. Join column specifies the foreign key in the database.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private boolean used;

    public PasswordResetToken(String token, Instant expiryDate, User user) {
        this.token = token;
        this.expiryDate = expiryDate;
        this.user = user;
    }
}
