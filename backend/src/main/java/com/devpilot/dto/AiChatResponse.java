package com.devpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {
    private Long id;
    private String title;
    private String categoryTemplate;
    private List<AiMessageResponse> messages;
    private LocalDateTime updatedAt;
}
