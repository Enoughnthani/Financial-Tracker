package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
