package com.bengregory.notes.repository;

import java.util.List;
import com.bengregory.notes.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwnerUsername(String username);
}
