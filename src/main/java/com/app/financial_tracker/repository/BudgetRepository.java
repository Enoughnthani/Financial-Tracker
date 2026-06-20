package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;



public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
