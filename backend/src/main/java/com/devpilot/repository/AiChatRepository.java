package com.devpilot.repository;

import com.devpilot.entity.AiChat;
import com.devpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatRepository extends JpaRepository<AiChat, Long> {
    List<AiChat> findByUserOrderByUpdatedAtDesc(User user);
}
