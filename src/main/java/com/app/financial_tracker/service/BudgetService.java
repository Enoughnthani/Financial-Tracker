package com.app.financial_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.Budget;
import com.app.financial_tracker.repository.BudgetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public Budget save(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> findAll() {
        return budgetRepository.findAll();
    }

    public Budget findById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public void delete(Long id) {
        budgetRepository.deleteById(id);
    }

    public Budget increaseBudget(Long id, Double amount) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        BigDecimal add = BigDecimal.valueOf(amount != null ? amount : 0.0);
        BigDecimal current = budget.getAmount() != null ? budget.getAmount() : BigDecimal.ZERO;
        budget.setAmount(current.add(add));

        return budgetRepository.save(budget);
    }

    public Budget decreaseBudget(Long id, Double amount) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        BigDecimal sub = BigDecimal.valueOf(amount != null ? amount : 0.0);
        BigDecimal current = budget.getAmount() != null ? budget.getAmount() : BigDecimal.ZERO;
        BigDecimal newAmount = current.subtract(sub);
        if (newAmount.compareTo(BigDecimal.ZERO) < 0) {
            newAmount = BigDecimal.ZERO;
        }
        budget.setAmount(newAmount);

        return budgetRepository.save(budget);
    }
}
