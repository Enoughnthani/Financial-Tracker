package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.IncomeSource;
import org.springframework.data.jpa.repository.JpaRepository;



public interface IncomeSourceRepository extends JpaRepository<IncomeSource, Long> {
}
