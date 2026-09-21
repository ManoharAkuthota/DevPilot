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
public class GitHubProfileResponse {
    private Long id;
    private String username;
    private String avatarUrl;
    private String bio;
    private Integer publicRepos;
    private Integer followers;
    private Integer following;
    private Integer totalStars;
    private Integer totalForks;
    private Integer contributionsCount;
    private String languagesJson;
    private String commitActivityJson;
    private List<RepositoryResponse> repositories;
    private LocalDateTime updatedAt;
}
