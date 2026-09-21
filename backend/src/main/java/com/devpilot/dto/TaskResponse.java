package com.devpilot.dto;

import com.devpilot.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private Integer positionIndex;
    private LocalDate dueDate;
    private String labels;
    private Double estimatedHours;
    private List<TaskCommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
