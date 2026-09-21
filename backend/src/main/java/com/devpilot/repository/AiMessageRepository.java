package com.devpilot.repository;

import com.devpilot.entity.AiChat;
import com.devpilot.entity.AiMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiMessageRepository extends JpaRepository<AiMessage, Long> {
    List<AiMessage> findByChatOrderByCreatedAtAsc(AiChat chat);
}
