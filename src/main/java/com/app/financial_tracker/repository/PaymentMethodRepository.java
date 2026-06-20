package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;



public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
}
