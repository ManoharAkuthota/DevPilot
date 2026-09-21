package com.devpilot.controller;

import com.devpilot.dto.ApiResponse;
import com.devpilot.dto.ChangePasswordRequest;
import com.devpilot.dto.UpdateProfileRequest;
import com.devpilot.dto.UserProfileResponse;
import com.devpilot.security.UserPrincipal;
import com.devpilot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for developer profile and account settings")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Retrieves the authenticated user's developer profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileResponse response = userService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Updates developer bio, avatar, tech stack, and portfolio links")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Updates user password after verifying current credentials")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }
}
