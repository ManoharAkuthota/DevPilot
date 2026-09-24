package com.devpilot.service;

import com.devpilot.dto.ChangePasswordRequest;
import com.devpilot.dto.UpdateProfileRequest;
import com.devpilot.dto.UserProfileResponse;
import com.devpilot.entity.User;
import com.devpilot.exception.BadRequestException;
import com.devpilot.exception.ResourceNotFoundException;
import com.devpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = getUserEntity(userId);
        return authService.mapToUserProfile(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserEntity(userId);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getTechStack() != null) user.setTechStack(request.getTechStack());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getPortfolioUrl() != null) user.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getGithubUsername() != null) user.setGithubUsername(request.getGithubUsername());
        if (request.getProductivityScore() != null) user.setProductivityScore(request.getProductivityScore());
        if (request.getAiProvider() != null) user.setAiProvider(request.getAiProvider());
        if (request.getAiApiKey() != null) user.setAiApiKey(request.getAiApiKey());

        User updatedUser = userRepository.save(user);
        return authService.mapToUserProfile(updatedUser);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserEntity(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
