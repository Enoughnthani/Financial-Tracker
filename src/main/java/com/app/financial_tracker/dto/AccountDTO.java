package com.app.financial_tracker.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

    private Long id;

    private String accountName;

    private BigDecimal balance;

    private Long userId;

    private Long accountTypeId;

}