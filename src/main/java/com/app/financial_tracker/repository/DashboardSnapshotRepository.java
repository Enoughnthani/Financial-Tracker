package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.DashboardSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;



public interface DashboardSnapshotRepository extends JpaRepository<DashboardSnapshot, Long> {
}
