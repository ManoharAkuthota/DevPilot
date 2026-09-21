package com.devpilot.controller;

import com.devpilot.dto.*;
import com.devpilot.security.UserPrincipal;
import com.devpilot.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "Jira/Linear style Kanban board task management endpoints")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieves all Kanban tasks for the authenticated developer")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<TaskResponse> tasks = taskService.getAllTasks(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves detailed information for a specific task")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        TaskResponse task = taskService.getTaskById(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(task));
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Creates a new task in the Kanban board")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.createTask(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Updates title, description, priority, or tags for a task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestBody TaskRequest request) {
        TaskResponse task = taskService.updateTask(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", task));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status / column", description = "Moves task between Kanban columns (TODO, IN_PROGRESS, REVIEW, DONE)")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateRequest request) {
        TaskResponse task = taskService.updateTaskStatus(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Removes a task from the board")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        taskService.deleteTask(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add comment to task", description = "Posts a collaboration comment on a task")
    public ResponseEntity<ApiResponse<TaskCommentResponse>> addComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody TaskCommentRequest request) {
        TaskCommentResponse comment = taskService.addComment(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Comment added successfully", comment));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get task comments", description = "Retrieves comment discussion thread for a task")
    public ResponseEntity<ApiResponse<List<TaskCommentResponse>>> getComments(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        List<TaskCommentResponse> comments = taskService.getComments(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(comments));
    }
}
