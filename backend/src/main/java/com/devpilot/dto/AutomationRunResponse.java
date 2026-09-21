package com.devpilot.dto;

import com.devpilot.entity.AutomationRun;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutomationRunResponse {
    private Long id;
    private Long automationId;
    private String automationName;
    private AutomationRun.Status status;
    private String screenshotUrl;
    private String capturedTitle;
    private String logs;
    private Long durationMs;
    private LocalDateTime executedAt;
}
