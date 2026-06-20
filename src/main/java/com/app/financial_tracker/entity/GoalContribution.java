package com.app.financial_tracker.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_contribution")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private BigDecimal amount;

    private LocalDateTime contributionDate;


    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;

}