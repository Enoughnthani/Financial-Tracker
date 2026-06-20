package com.app.financial_tracker.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
}