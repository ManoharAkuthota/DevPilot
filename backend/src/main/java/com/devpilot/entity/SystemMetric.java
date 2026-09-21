package com.devpilot.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cpu_usage_pct")
    private Double cpuUsagePct;

    @Column(name = "memory_used_mb")
    private Long memoryUsedMb;

    @Column(name = "memory_total_mb")
    private Long memoryTotalMb;

    @Column(name = "memory_usage_pct")
    private Double memoryUsagePct;

    @Column(name = "disk_used_gb")
    private Double diskUsedGb;

    @Column(name = "disk_total_gb")
    private Double diskTotalGb;

    @Column(name = "active_threads")
    private Integer activeThreads;

    @Column(name = "uptime_seconds")
    private Long uptimeSeconds;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;
}
