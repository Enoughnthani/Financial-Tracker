package com.app.financial_tracker.service;

import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.Budget;
import com.app.financial_tracker.repository.BudgetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;


    public BudgetResponse save(BudgetRequest request) {

    BudgetCategory category = budgetCategoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Invalid budget category id"));

    Budget budget;

    if (request.getId() != null) {

        budget = budgetRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));

    } else {

        budget = new Budget();
        category.getBudget().add(budget);

    }

    budget.setName(request.getName());
    budget.setAmount(request.getAmount());
    budget.setCategory(category);

    budgetRepository.save(budget);

    return MapBudget(budget);
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


    public @Nullable Object findAllPeriods() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAllPeriods'");
    }

}
