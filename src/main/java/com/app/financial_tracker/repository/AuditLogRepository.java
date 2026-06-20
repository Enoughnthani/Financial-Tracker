package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;



public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
