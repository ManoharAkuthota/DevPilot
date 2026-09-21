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
public class SystemMetricResponse {
    private Double cpuUsagePct;
    private Long memoryUsedMb;
    private Long memoryTotalMb;
    private Double memoryUsagePct;
    private Double diskUsedGb;
    private Double diskTotalGb;
    private Double diskUsagePct;
    private Integer activeThreads;
    private Integer availableProcessors;
    private Long uptimeSeconds;
    private String osName;
    private String osArch;
    private String javaVersion;
    private List<ProcessInfoResponse> topProcesses;
    private LocalDateTime timestamp;
}
