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
@Table(name = "github_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitHubProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(length = 1000)
    private String bio;

    @Column(name = "public_repos")
    @Builder.Default
    private Integer publicRepos = 0;

    @Builder.Default
    private Integer followers = 0;

    @Builder.Default
    private Integer following = 0;

    @Column(name = "total_stars")
    @Builder.Default
    private Integer totalStars = 0;

    @Column(name = "total_forks")
    @Builder.Default
    private Integer totalForks = 0;

    @Column(name = "contributions_count")
    @Builder.Default
    private Integer contributionsCount = 0;

    @Column(name = "languages_json", columnDefinition = "TEXT")
    private String languagesJson;

    @Column(name = "commit_activity_json", columnDefinition = "TEXT")
    private String commitActivityJson;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RepositoryEntity> repositories = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
