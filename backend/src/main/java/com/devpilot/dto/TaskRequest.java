package com.devpilot.dto;

import com.devpilot.entity.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private Task.Status status = Task.Status.TODO;
    private Task.Priority priority = Task.Priority.MEDIUM;
    private Integer positionIndex = 0;
    private LocalDate dueDate;
    private String labels;
    private Double estimatedHours;
}
