package com.devpilot.controller;

import com.devpilot.dto.ApiResponse;
import com.devpilot.dto.GitHubConnectRequest;
import com.devpilot.dto.GitHubProfileResponse;
import com.devpilot.dto.RepositoryResponse;
import com.devpilot.security.UserPrincipal;
import com.devpilot.service.GitHubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
@Tag(name = "GitHub Analytics", description = "Endpoints for GitHub profile connection, repositories, commits, and AI repository summaries")
public class GitHubController {

    private final GitHubService gitHubService;

    @PostMapping("/connect")
    @Operation(summary = "Connect GitHub account", description = "Links a GitHub handle and syncs repositories, stars, and language distribution")
    public ResponseEntity<ApiResponse<GitHubProfileResponse>> connect(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody GitHubConnectRequest request) {
        GitHubProfileResponse response = gitHubService.connectAccount(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("GitHub account synced successfully", response));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get GitHub profile", description = "Fetches the connected GitHub account details, stars, and contribution statistics")
    public ResponseEntity<ApiResponse<GitHubProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GitHubProfileResponse response = gitHubService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/repos")
    @Operation(summary = "Get GitHub repositories", description = "Retrieves user repositories with search filtering and sorting")
    public ResponseEntity<ApiResponse<List<RepositoryResponse>>> getRepositories(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String keyword) {
        List<RepositoryResponse> response = gitHubService.getRepositories(userPrincipal.getId(), keyword);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/repos/{id}/ai-summary")
    @Operation(summary = "Generate AI Repository Summary", description = "Produces architectural insights and test coverage recommendations for a repository")
    public ResponseEntity<ApiResponse<RepositoryResponse>> generateAiSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        RepositoryResponse response = gitHubService.generateAiSummary(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("AI Summary generated successfully", response));
    }
}
