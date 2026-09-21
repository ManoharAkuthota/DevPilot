package com.devpilot.repository;

import com.devpilot.entity.SystemMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemMetricRepository extends JpaRepository<SystemMetric, Long> {
    List<SystemMetric> findTop30ByOrderByRecordedAtDesc();
}
