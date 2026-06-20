package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.BudgetPeriod;
import org.springframework.data.jpa.repository.JpaRepository;



public interface BudgetPeriodRepository extends JpaRepository<BudgetPeriod, Long> {
}
