package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.UserPreference;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    Optional<UserPreference> findByUserId(Long userId);
}
