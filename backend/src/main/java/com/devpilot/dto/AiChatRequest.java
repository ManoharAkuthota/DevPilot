package com.devpilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiChatRequest {
    private Long chatId; // null if new conversation
    @NotBlank(message = "Prompt cannot be empty")
    private String prompt;
    private String categoryTemplate; // e.g. "CODE_EXPLAIN", "BUG_DETECT", "REFACTOR", "SQL_HELPER", "SPRING_BOOT", "REACT", "GENERAL"
    private String codeSnippet;
    private String language;
}
