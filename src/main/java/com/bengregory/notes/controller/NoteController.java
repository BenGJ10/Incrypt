package com.bengregory.notes.controller;

import com.bengregory.notes.model.Note;
import com.bengregory.notes.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Create a new note for the authenticated user
    // Use @AuthenticationPrincipal to get user details of the logged-in user
    @PostMapping 
    public Note createNote(@RequestBody String content,
                           @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        System.out.println("Adding note to the db of: " + username);
        return noteService.createNoteForUser(username, content);
    }

    // Get all notes for the authenticated user
    @GetMapping
    public List<Note> getUserNotes(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        System.out.println("Fetching notes of: " + username);
        return noteService.getNotesForUser(username);
    }

    // Update a note for the authenticated user
    @PutMapping("/{noteId}")
    public Note updateNote(@PathVariable Long noteId,
                           @RequestBody String content,
                           @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        System.out.println("Updating note of: " + username);
        return noteService.updateNoteForUser(noteId, content, username);
    }

    // Delete a note for the authenticated user
    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Long noteId,
                           @AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        System.out.println("Deleting note of: " + username);
        noteService.deleteNoteForUser(noteId, username);
    }
}
