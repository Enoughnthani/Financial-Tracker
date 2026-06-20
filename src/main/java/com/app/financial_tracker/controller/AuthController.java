package com.app.financial_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.dto.AuthResponse;
import com.app.financial_tracker.dto.RegisterRequest;
import com.app.financial_tracker.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/user")
    public ResponseEntity<AuthResponse> getCurrentUser(@RequestParam String email) {
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @GetMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }
}