package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;



public interface InvestmentRepository extends JpaRepository<Investment, Long> {
}
