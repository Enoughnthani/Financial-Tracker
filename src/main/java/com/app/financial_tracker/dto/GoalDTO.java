package com.app.financial_tracker.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalDTO {

    private Long id;

    private String goalName;

    private BigDecimal targetAmount;

    private BigDecimal currentAmount;

    private String status;

    private Long userId;

}