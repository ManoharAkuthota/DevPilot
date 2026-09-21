package com.devpilot.repository;

import com.devpilot.entity.Automation;
import com.devpilot.entity.AutomationRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationRunRepository extends JpaRepository<AutomationRun, Long> {
    List<AutomationRun> findByAutomationOrderByExecutedAtDesc(Automation automation);
    List<AutomationRun> findTop20ByAutomation_UserOrderByExecutedAtDesc(com.devpilot.entity.User user);
}
