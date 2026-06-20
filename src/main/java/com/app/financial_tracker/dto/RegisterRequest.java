package com.app.financial_tracker.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
}