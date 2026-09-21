package com.devpilot.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String techStack;
    private String skills;
    private String portfolioUrl;
    private String githubUsername;
    private Integer productivityScore;
}
