package com.bengregory.notes.service;

import java.util.List;
import com.bengregory.notes.model.Note;

public interface INoteService {

    Note createNoteForUser(String username, String content);

    Note updateNoteForUser(Long noteId, String content, String username);

    void deleteNoteForUser(Long noteId, String username);

    List<Note> getNotesForUser(String username);
}
