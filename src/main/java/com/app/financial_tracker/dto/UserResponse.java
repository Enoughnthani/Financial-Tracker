package com.app.financial_tracker.dto;

import com.app.financial_tracker.entity.Currency.CurrencyCode;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String theme;
    private Boolean notificationsEnabled;
    private Long currencyId;
    private CurrencyCode currencyCode;
}