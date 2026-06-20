package com.app.financial_tracker.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_insight")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;

    private String message;

    private String type;

    private String priority;

    private Boolean isRead;

    private LocalDateTime generatedAt;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}