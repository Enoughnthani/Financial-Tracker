package com.app.financial_tracker.repository;

import com.app.financial_tracker.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;



public interface RoleRepository extends JpaRepository<Role, Long> {
}
