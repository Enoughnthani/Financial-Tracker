package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;



public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {
}
