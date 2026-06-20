package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
