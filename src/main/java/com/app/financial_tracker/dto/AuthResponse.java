package com.app.financial_tracker.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String message;
}