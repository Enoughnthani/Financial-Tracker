package com.app.financial_tracker.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private Long id;
    private String accountName;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private AccountTypeDTO accountType;
    private Long userId;
    
    @Data
    public static class AccountTypeDTO {
        private Long id;
        private String name;
    }
}