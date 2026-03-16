package com.bengregory.notes.controller;

import com.bengregory.notes.model.AuditLog;
import com.bengregory.notes.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public List<AuditLog> getAuditLogs(){
        return auditLogService.getAllAuditLogs();
    }

    @GetMapping("/note/{noteId}")
    public List<AuditLog> getNoteAuditLogs(@PathVariable Long noteId){
        return auditLogService.getAuditLogsForNote(noteId);
    }
}
