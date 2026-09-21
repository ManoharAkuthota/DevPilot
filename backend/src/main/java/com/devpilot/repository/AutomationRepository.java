package com.devpilot.repository;

import com.devpilot.entity.Automation;
import com.devpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationRepository extends JpaRepository<Automation, Long> {
    List<Automation> findByUserOrderByCreatedAtDesc(User user);
}
