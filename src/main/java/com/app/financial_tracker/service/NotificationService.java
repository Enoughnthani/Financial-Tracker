package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.Notification;
import com.app.financial_tracker.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;


    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }


    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }


    public Notification findById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }


    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }

}