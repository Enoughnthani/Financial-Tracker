package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.GoalContribution;
import org.springframework.data.jpa.repository.JpaRepository;



public interface GoalContributionRepository extends JpaRepository<GoalContribution, Long> {
}
