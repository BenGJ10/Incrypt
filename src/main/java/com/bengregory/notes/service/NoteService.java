package com.bengregory.notes.service;

import java.util.List;
import com.bengregory.notes.model.Note;
import org.springframework.stereotype.Service;


@Service
public class NoteService implements INoteService{

    @Override
    public Note createNoteForUser(String username, String content) {
        return null;
    }

    @Override
    public Note updateNoteForUser(Long noteId, String content, String username) {
        return null;
    }

    @Override
    public void deleteNoteForUser(Long noteId, String username) {

    }

    @Override
    public List<Note> getNotesForUser(String username) {
        return List.of();
    }
}
