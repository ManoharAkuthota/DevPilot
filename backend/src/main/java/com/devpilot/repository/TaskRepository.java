package com.devpilot.repository;

import com.devpilot.entity.Task;
import com.devpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserOrderByPositionIndexAscCreatedAtDesc(User user);
    List<Task> findByUserAndStatusOrderByPositionIndexAsc(User user, Task.Status status);
    List<Task> findByUserAndDueDateBetween(User user, LocalDate start, LocalDate end);
    long countByUserAndStatus(User user, Task.Status status);
}
