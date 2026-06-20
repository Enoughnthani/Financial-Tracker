package com.app.financial_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "debt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Debt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal totalAmount;

    private BigDecimal remainingAmount;

    private Double interestRate;

    private LocalDate dueDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}