package com.bengregory.notes.service;

import java.util.List;
import java.time.LocalDateTime;
import com.bengregory.notes.model.Note;
import com.bengregory.notes.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class NoteService implements INoteService{

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public Note createNoteForUser(String username, String content) {
        Note note = new Note();
        note.setContent(content);
        note.setUsername(username);
        Note newNote =  noteRepository.save(note);
        auditLogService.logNoteCreation(username, newNote);
        return newNote;
    }

    @Override
    public Note updateNoteForUser(Long noteId, String content, String username) {
        Note note = noteRepository.findById(noteId).orElseThrow(
                () -> new RuntimeException("Note not found in the db!"));
        note.setContent(content);
        Note updatedNote = noteRepository.save(note);
        auditLogService.logNoteUpdate(username, updatedNote);
        return updatedNote;
    }

    @Override
    public void deleteNoteForUser(Long noteId, String username) {
        Note note = noteRepository.findById(noteId).orElseThrow(
                () -> new RuntimeException("Note not found in the db!"));
        noteRepository.delete(note);
        auditLogService.logNoteDeletion(username, noteId);
    }

    @Override
    public List<Note> getNotesForUser(String username) {
        List<Note> notesForUser = noteRepository.findByUsername(username);

        boolean hasLegacyNotes = false;
        for (Note note : notesForUser) {
            if (note.getCreatedAt() == null) {
                note.setCreatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt() : LocalDateTime.now());
                hasLegacyNotes = true;
            }
        }

        if (hasLegacyNotes) {
            noteRepository.saveAll(notesForUser);
        }

        return notesForUser;
    }
}
