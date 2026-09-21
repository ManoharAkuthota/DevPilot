package com.devpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessInfoResponse {
    private Long pid;
    private String name;
    private String command;
    private Double cpuUsagePct;
    private Long memoryMb;
    private String user;
    private String status;
}
