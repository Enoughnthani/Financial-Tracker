package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
}
