package com.app.financial_tracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TransactionResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private String transactionType;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
    private Long accountId;
    private String category;
    private String accountName;
}