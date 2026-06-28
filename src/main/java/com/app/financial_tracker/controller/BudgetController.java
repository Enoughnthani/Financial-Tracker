package com.app.financial_tracker.controller;

import com.app.financial_tracker.entity.Budget;
import com.app.financial_tracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.save(budget));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @RequestBody Budget budget) {
        budget.setId(id);
        return ResponseEntity.ok(budgetService.save(budget));
    }
    @PatchMapping("/{id}/increase")
public ResponseEntity<BudgetResponse> increaseBudget(
        @PathVariable Long id,
        @RequestParam Double amount){

    return ResponseEntity.ok(
            budgetService.increaseBudget(id, amount)
    );
}
    @PatchMapping("/{id}/decrease")
public ResponseEntity<BudgetResponse> decreaseBudget(
        @PathVariable Long id,
        @RequestParam Double amount){

    return ResponseEntity.ok(
            budgetService.decreaseBudget(id, amount)
    );
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.ok().build();
    }
}
