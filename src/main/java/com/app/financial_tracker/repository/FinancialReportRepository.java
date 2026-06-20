package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;



public interface FinancialReportRepository extends JpaRepository<FinancialReport, Long> {
}
