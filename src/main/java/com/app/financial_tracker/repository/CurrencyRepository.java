package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Currency;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface CurrencyRepository extends JpaRepository<Currency, Long> {

    Optional<Currency> findByCurrencyCode(String code);
}
