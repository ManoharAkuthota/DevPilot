package com.devpilot.dto;

import com.devpilot.entity.Automation;
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
public class AutomationResponse {
    private Long id;
    private String name;
    private String description;
    private String targetUrl;
    private String actionType;
    private String actionsJson;
    private String scheduleCron;
    private Automation.Status status;
    private List<AutomationRunResponse> runs;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
