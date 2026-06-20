package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Debt;
import org.springframework.data.jpa.repository.JpaRepository;



public interface DebtRepository extends JpaRepository<Debt, Long> {
}
