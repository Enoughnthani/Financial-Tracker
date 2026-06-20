package com.app.financial_tracker.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.dto.AuthResponse;
import com.app.financial_tracker.dto.RegisterRequest;
import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setProfilePicture(user.getProfilePicture());

        return response;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setId(saved.getId());
        response.setFullName(saved.getFullName());
        response.setEmail(saved.getEmail());
        response.setProfilePicture(saved.getProfilePicture());

        return response;
    }

    public AuthResponse logout() {
        AuthResponse response = new AuthResponse();
        response.setMessage("Logged out successfully");
        return response;
    }
}