package com.bengregory.notes.service;

import com.bengregory.notes.model.AuditLog;
import com.bengregory.notes.model.Note;

import java.util.List;

public interface IAuditLogService {

    void logNoteCreation(String username, Note note);

    void logNoteUpdate(String username, Note note);

    void logNoteDeletion(String username, Long noteId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNote(Long noteId);
}
