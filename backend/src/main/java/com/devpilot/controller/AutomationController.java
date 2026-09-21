package com.devpilot.controller;

import com.devpilot.dto.ApiResponse;
import com.devpilot.dto.AutomationRequest;
import com.devpilot.dto.AutomationResponse;
import com.devpilot.dto.AutomationRunResponse;
import com.devpilot.security.UserPrincipal;
import com.devpilot.service.AutomationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automation")
@RequiredArgsConstructor
@Tag(name = "Browser Automation", description = "Endpoints for creating and executing Playwright Java web automation workflows")
public class AutomationController {

    private final AutomationService automationService;

    @PostMapping("/create")
    @Operation(summary = "Create automation workflow", description = "Defines a new Playwright browser automation target and actions")
    public ResponseEntity<ApiResponse<AutomationResponse>> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AutomationRequest request) {
        AutomationResponse response = automationService.createAutomation(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Automation workflow created", response));
    }

    @GetMapping
    @Operation(summary = "List all automations", description = "Retrieves all browser automations configured by the developer")
    public ResponseEntity<ApiResponse<List<AutomationResponse>>> getAll(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AutomationResponse> automations = automationService.getAllAutomations(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(automations));
    }

    @PostMapping("/{id}/run")
    @Operation(summary = "Execute browser automation", description = "Launches Playwright headless browser to execute workflow and capture screenshot")
    public ResponseEntity<ApiResponse<AutomationRunResponse>> run(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        AutomationRunResponse runResponse = automationService.runAutomation(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Automation executed successfully", runResponse));
    }

    @GetMapping("/{id}/runs")
    @Operation(summary = "Get automation run history", description = "Retrieves past execution logs, durations, and screenshots for an automation")
    public ResponseEntity<ApiResponse<List<AutomationRunResponse>>> getRuns(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        List<AutomationRunResponse> runs = automationService.getRuns(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(runs));
    }
}
