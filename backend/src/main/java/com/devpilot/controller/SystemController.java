package com.devpilot.controller;

import com.devpilot.dto.ApiResponse;
import com.devpilot.dto.SystemMetricResponse;
import com.devpilot.entity.SystemMetric;
import com.devpilot.service.SystemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "System Monitor", description = "Live operating system metrics, memory, CPU load, and active processes")
public class SystemController {

    private final SystemService systemService;

    @GetMapping("/metrics")
    @Operation(summary = "Get live system metrics", description = "Returns real-time CPU, RAM, Disk, Uptime, and top processes (polled every 3 seconds)")
    public ResponseEntity<ApiResponse<SystemMetricResponse>> getLiveMetrics() {
        SystemMetricResponse response = systemService.getLiveMetrics();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get historical system metrics", description = "Returns recorded metric data points for CPU and Memory trend charts")
    public ResponseEntity<ApiResponse<List<SystemMetric>>> getHistoricalMetrics() {
        List<SystemMetric> history = systemService.getHistoricalMetrics();
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
