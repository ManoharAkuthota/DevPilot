package com.devpilot.controller;

import com.devpilot.dto.AiChatRequest;
import com.devpilot.dto.AiChatResponse;
import com.devpilot.dto.ApiResponse;
import com.devpilot.security.UserPrincipal;
import com.devpilot.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Coding Assistant", description = "Endpoints for Ollama Llama 3.1 AI chat, code explanations, bug detection, and templates")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Assistant", description = "Sends a prompt/code snippet to Ollama (Llama 3.1 local) or AI engine and receives smart contextual response")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.chat(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get AI conversation history", description = "Retrieves previous chat conversations for the user")
    public ResponseEntity<ApiResponse<List<AiChatResponse>>> getHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AiChatResponse> history = aiService.getHistory(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/chats/{id}")
    @Operation(summary = "Get single chat", description = "Retrieves messages for a specific conversation")
    public ResponseEntity<ApiResponse<AiChatResponse>> getChat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        AiChatResponse chat = aiService.getChat(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(chat));
    }

    @DeleteMapping("/chats/{id}")
    @Operation(summary = "Delete chat", description = "Removes an AI conversation from history")
    public ResponseEntity<ApiResponse<Void>> deleteChat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        aiService.deleteChat(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Chat deleted successfully", null));
    }
}
