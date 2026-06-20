package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.TransactionCategory;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory, Long> {

    Optional<TransactionCategory> findByName(String name);

    List<TransactionCategory> findAllByName(String name);
}
