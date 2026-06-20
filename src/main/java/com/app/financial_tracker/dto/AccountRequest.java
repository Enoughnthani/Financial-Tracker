package com.app.financial_tracker.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    private String accountName;
    private BigDecimal balance;
    private AccountTypeDTO accountType;
    
    @Data
    public static class AccountTypeDTO {
        private String name;
        private Long id;
    }
}