package com.app.financial_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.dto.PreferencesRequest;
import com.app.financial_tracker.dto.UserResponse;
import com.app.financial_tracker.dto.UserUpdateRequest;
import com.app.financial_tracker.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getProfile(authentication));
    }

    @PostMapping("/update")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UserUpdateRequest request, Authentication authentication) {
        return ResponseEntity.ok(profileService.updateProfile(request, authentication));
    }

    @PostMapping("/preferences")
    public ResponseEntity<PreferencesRequest> updatePreferences(@RequestBody PreferencesRequest request, Authentication authentication) {
        return ResponseEntity.ok(profileService.updatePreferences(request, authentication));
    }
}