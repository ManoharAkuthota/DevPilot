package com.devpilot.repository;

import com.devpilot.entity.GitHubProfile;
import com.devpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GitHubProfileRepository extends JpaRepository<GitHubProfile, Long> {
    Optional<GitHubProfile> findByUser(User user);
    Optional<GitHubProfile> findByUser_Id(Long userId);
    Optional<GitHubProfile> findByUsername(String username);
}
