package com.devpilot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "repositories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @JsonIgnore
    private GitHubProfile profile;

    @Column(nullable = false)
    private String name;

    @Column(name = "full_name")
    private String fullName;

    @Column(length = 2000)
    private String description;

    @Column(name = "html_url")
    private String htmlUrl;

    private String language;

    @Column(name = "stars_count")
    @Builder.Default
    private Integer starsCount = 0;

    @Column(name = "forks_count")
    @Builder.Default
    private Integer forksCount = 0;

    @Column(name = "open_issues_count")
    @Builder.Default
    private Integer openIssuesCount = 0;

    @Column(name = "is_private")
    @Builder.Default
    private Boolean isPrivate = false;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "repo_updated_at")
    private LocalDateTime repoUpdatedAt;
}
