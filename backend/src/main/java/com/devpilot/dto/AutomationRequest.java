package com.devpilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutomationRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @NotBlank(message = "Target URL is required")
    private String targetUrl;
    private String actionType = "SCREENSHOT_CAPTURE";
    private String actionsJson;
    private String scheduleCron;
}
