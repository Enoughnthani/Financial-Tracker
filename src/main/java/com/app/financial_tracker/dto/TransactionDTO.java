package com.app.financial_tracker.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;

    private BigDecimal amount;

    private String transactionType;

    private String description;

    private Long accountId;

    private Long categoryId;

    private Long paymentMethodId;

}