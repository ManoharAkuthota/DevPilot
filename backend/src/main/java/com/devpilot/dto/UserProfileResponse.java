package com.devpilot.dto;

import com.devpilot.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String techStack;
    private String skills;
    private String portfolioUrl;
    private String githubUsername;
    private Integer productivityScore;
    private String aiProvider;
    private String aiApiKey;
    private Role role;
    private LocalDateTime createdAt;
}
