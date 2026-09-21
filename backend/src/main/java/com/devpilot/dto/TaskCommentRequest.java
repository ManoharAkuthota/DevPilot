package com.devpilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskCommentRequest {
    @NotBlank(message = "Comment cannot be empty")
    private String content;
}
