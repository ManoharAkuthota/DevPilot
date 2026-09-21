package com.devpilot.dto;

import com.devpilot.entity.Task;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private Task.Status status;
    private Integer positionIndex;
}
