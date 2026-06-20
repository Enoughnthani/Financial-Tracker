package com.app.financial_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.financial_tracker.dto.GoalRequest;
import com.app.financial_tracker.dto.GoalResponse;
import com.app.financial_tracker.entity.Goal;
import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.repository.GoalRepository;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Transactional
    public GoalResponse createGoal(GoalRequest request) {
        validateGoal(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Goal goal = new Goal();
        goal.setGoalName(request.getGoalName().trim());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO);
        goal.setTargetDate(request.getTargetDate());
        goal.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        goal.setUser(user);

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    @Transactional
    public GoalResponse updateGoal(Long id, GoalRequest request) {
        Goal existing = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        if (request.getGoalName() != null && !request.getGoalName().trim().isEmpty()) {
            existing.setGoalName(request.getGoalName().trim());
        }

        if (request.getTargetAmount() != null) {
            existing.setTargetAmount(request.getTargetAmount());
        }

        if (request.getCurrentAmount() != null) {
            existing.setCurrentAmount(request.getCurrentAmount());
        }

        if (request.getTargetDate() != null) {
            existing.setTargetDate(request.getTargetDate());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        Goal updated = goalRepository.save(existing);
        return toResponse(updated);
    }

    @Transactional
    public GoalResponse contributeToGoal(Long id, Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Contribution amount must be greater than 0");
        }

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        goal.setCurrentAmount(goal.getCurrentAmount().add(BigDecimal.valueOf(amount)));

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("COMPLETED");
        }

        Goal updated = goalRepository.save(goal);
        return toResponse(updated);
    }

    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        goalRepository.delete(goal);
    }

    public GoalResponse findGoalById(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));
        return toResponse(goal);
    }

    public List<GoalResponse> findAllGoals() {
        return goalRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<GoalResponse> findGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void validateGoal(GoalRequest request) {
        if (request.getGoalName() == null || request.getGoalName().trim().isEmpty()) {
            throw new IllegalArgumentException("Goal name is required");
        }
        if (request.getTargetAmount() == null || request.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target amount must be greater than 0");
        }
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
    }

    private GoalResponse toResponse(Goal goal) {
        GoalResponse response = new GoalResponse();
        response.setId(goal.getId());
        response.setGoalName(goal.getGoalName());
        response.setTargetAmount(goal.getTargetAmount());
        response.setCurrentAmount(goal.getCurrentAmount());
        response.setTargetDate(goal.getTargetDate());
        response.setStatus(goal.getStatus());

        if (goal.getUser() != null) {
            response.setUserId(goal.getUser().getId());
        }

        return response;
    }
}