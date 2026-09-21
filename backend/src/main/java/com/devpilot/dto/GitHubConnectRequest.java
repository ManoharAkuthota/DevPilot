package com.devpilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GitHubConnectRequest {
    @NotBlank(message = "GitHub username is required")
    private String username;
    private String token; // Optional personal access token for higher rate limits
}
