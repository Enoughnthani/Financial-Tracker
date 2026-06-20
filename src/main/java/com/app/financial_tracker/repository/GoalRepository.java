package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Goal;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;



public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserId(Long userId);
}
