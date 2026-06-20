package com.app.financial_tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.dto.GoalRequest;
import com.app.financial_tracker.dto.GoalResponse;
import com.app.financial_tracker.service.GoalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAllGoals() {
        return ResponseEntity.ok(goalService.findAllGoals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.findGoalById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GoalResponse>> getGoalsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(goalService.findGoalsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(@PathVariable Long id, @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<GoalResponse> contributeToGoal(@PathVariable Long id, @RequestParam Double amount) {
        return ResponseEntity.ok(goalService.contributeToGoal(id, amount));
    }
}