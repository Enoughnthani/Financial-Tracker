package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;



public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
