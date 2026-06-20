package com.app.financial_tracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.financial_tracker.entity.AccountType;

public interface AccountTypeRepository extends JpaRepository<AccountType, Long> {
    Optional<AccountType> findByType(String type);
}