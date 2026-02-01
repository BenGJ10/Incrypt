package com.bengregory.notes.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob // Use Large Object for potentially large text content
    private String content;

    private String username;
}
