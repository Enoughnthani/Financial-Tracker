package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.AuthenticationProvider;
import org.springframework.data.jpa.repository.JpaRepository;



public interface AuthenticationProviderRepository extends JpaRepository<AuthenticationProvider, Long> {
}
