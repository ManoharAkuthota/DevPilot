package com.devpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryResponse {
    private Long id;
    private String name;
    private String fullName;
    private String description;
    private String htmlUrl;
    private String language;
    private Integer starsCount;
    private Integer forksCount;
    private Integer openIssuesCount;
    private Boolean isPrivate;
    private String aiSummary;
    private LocalDateTime repoUpdatedAt;
}
