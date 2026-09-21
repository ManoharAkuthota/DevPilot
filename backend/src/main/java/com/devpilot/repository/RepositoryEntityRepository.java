package com.devpilot.repository;

import com.devpilot.entity.GitHubProfile;
import com.devpilot.entity.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositoryEntityRepository extends JpaRepository<RepositoryEntity, Long> {
    List<RepositoryEntity> findByProfile(GitHubProfile profile);
    List<RepositoryEntity> findByProfileOrderByStarsCountDesc(GitHubProfile profile);
    List<RepositoryEntity> findByProfileAndNameContainingIgnoreCase(GitHubProfile profile, String keyword);
}
