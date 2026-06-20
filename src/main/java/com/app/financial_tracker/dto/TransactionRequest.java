package com.app.financial_tracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long categoryId;
    private String description;
    private BigDecimal amount;
    private String transactionType;
    private Long accountId;  
    private String category; 
    private LocalDate transactionDate;
}