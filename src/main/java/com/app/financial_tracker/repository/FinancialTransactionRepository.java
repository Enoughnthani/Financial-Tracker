package com.app.financial_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.financial_tracker.entity.Account;
import com.app.financial_tracker.entity.FinancialTransaction;



public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {

    List<FinancialTransaction> findByAccountId(Long accountId);

    List<Account> findByAccount_UserId(Long id);
}
