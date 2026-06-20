package com.app.financial_tracker.dto;

import com.app.financial_tracker.entity.Currency.CurrencyCode;

import lombok.Data;

@Data
public class PreferencesRequest {
    private String theme;
    private CurrencyCode currencyCode;
    private Boolean notifications;
}