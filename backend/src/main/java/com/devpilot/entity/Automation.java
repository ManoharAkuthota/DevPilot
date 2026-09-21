package com.devpilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "automations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Automation {

    public enum Status {
        ACTIVE,
        PAUSED,
        DRAFT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "target_url", nullable = false, length = 500)
    private String targetUrl;

    @Column(name = "action_type", nullable = false, length = 50)
    @Builder.Default
    private String actionType = "SCREENSHOT_CAPTURE";

    @Column(name = "actions_json", columnDefinition = "TEXT")
    private String actionsJson;

    @Column(name = "schedule_cron", length = 50)
    private String scheduleCron;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @OneToMany(mappedBy = "automation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("executedAt DESC")
    @Builder.Default
    private List<AutomationRun> runs = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
