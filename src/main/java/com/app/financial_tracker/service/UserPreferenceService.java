package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.UserPreference;
import com.app.financial_tracker.repository.UserPreferenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreference save(UserPreference preference) {
        return userPreferenceRepository.save(preference);
    }

    public List<UserPreference> findAll() {
        return userPreferenceRepository.findAll();
    }

    public UserPreference findById(Long id) {
        return userPreferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preference not found"));
    }

    public UserPreference findByUserId(Long userId) {
        return userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Preference not found for user"));
    }

    public void delete(Long id) {
        userPreferenceRepository.deleteById(id);
    }
}