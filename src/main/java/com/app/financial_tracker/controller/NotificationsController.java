package com.app.financial_tracker.controller;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.app.financial_tracker.entity.Notification;
import com.app.financial_tracker.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationsController {

    private final NotificationService notificationService;

    @GetMapping
    public String notifications(Model model) {
        List<Notification> notifications = notificationService.findAll();
        if (notifications.isEmpty()) {
            createSampleNotifications();
        }
        model.addAttribute("notifications", notificationService.findAll());
        return "notifications";
    }

    private void createSampleNotifications() {
        Notification n1 = new Notification();
        n1.setTitle("💳 Transaction Alert");
        n1.setMessage("You made a transaction of $150.00 at Grocery Store");
        n1.setType("TRANSACTION");
        n1.setIsRead(false);
        n1.setCreatedAt(LocalDateTime.now());
        notificationService.save(n1);

        Notification n2 = new Notification();
        n2.setTitle("🎯 Goal Update");
        n2.setMessage("You're 50% closer to your Emergency Fund goal!");
        n2.setType("GOAL");
        n2.setIsRead(false);
        n2.setCreatedAt(LocalDateTime.now().minusHours(3));
        notificationService.save(n2);

        Notification n3 = new Notification();
        n3.setTitle("📊 Weekly Report");
        n3.setMessage("Your spending is up 5% compared to last week.");
        n3.setType("REPORT");
        n3.setIsRead(true);
        n3.setCreatedAt(LocalDateTime.now().minusDays(2));
        notificationService.save(n3);
    }

    @GetMapping("/read/{id}")
    public String markRead(@PathVariable Long id) {
        Notification notification = notificationService.findById(id);
        notification.setIsRead(true);
        notificationService.save(notification);
        return "redirect:/notifications";
    }

    @GetMapping("/delete/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.delete(id);
        return "redirect:/notifications";
    }

    @GetMapping("/mark-read")
    public String markAllRead() {
        List<Notification> notifications = notificationService.findAll();
        notifications.forEach(n -> {
            n.setIsRead(true);
            notificationService.save(n);
        });
        return "redirect:/notifications";
    }
}