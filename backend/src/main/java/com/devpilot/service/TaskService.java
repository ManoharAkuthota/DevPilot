package com.devpilot.service;

import com.devpilot.dto.*;
import com.devpilot.entity.Task;
import com.devpilot.entity.TaskComment;
import com.devpilot.entity.User;
import com.devpilot.exception.ResourceNotFoundException;
import com.devpilot.repository.TaskCommentRepository;
import com.devpilot.repository.TaskRepository;
import com.devpilot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(Long userId) {
        User user = getUser(userId);
        return taskRepository.findByUserOrderByPositionIndexAscCreatedAtDesc(user)
                .stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long userId, Long taskId) {
        Task task = getTask(userId, taskId);
        return mapToTaskResponse(task);
    }

    @Transactional
    public TaskResponse createTask(Long userId, TaskRequest request) {
        User user = getUser(userId);

        Task task = Task.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .positionIndex(request.getPositionIndex() != null ? request.getPositionIndex() : 0)
                .dueDate(request.getDueDate())
                .labels(request.getLabels())
                .estimatedHours(request.getEstimatedHours())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long userId, Long taskId, TaskRequest request) {
        Task task = getTask(userId, taskId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getPositionIndex() != null) task.setPositionIndex(request.getPositionIndex());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getLabels() != null) task.setLabels(request.getLabels());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(request.getEstimatedHours());

        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long userId, Long taskId, TaskStatusUpdateRequest request) {
        Task task = getTask(userId, taskId);
        task.setStatus(request.getStatus());
        if (request.getPositionIndex() != null) {
            task.setPositionIndex(request.getPositionIndex());
        }
        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long userId, Long taskId) {
        Task task = getTask(userId, taskId);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskCommentResponse addComment(Long userId, Long taskId, TaskCommentRequest request) {
        User user = getUser(userId);
        Task task = getTask(userId, taskId);

        TaskComment comment = TaskComment.builder()
                .task(task)
                .authorName(user.getFullName() != null ? user.getFullName() : user.getUsername())
                .authorAvatar(user.getAvatarUrl())
                .content(request.getContent())
                .build();

        TaskComment savedComment = commentRepository.save(comment);
        return mapToCommentResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<TaskCommentResponse> getComments(Long userId, Long taskId) {
        Task task = getTask(userId, taskId);
        return commentRepository.findByTaskOrderByCreatedAtAsc(task)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private Task getTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }
        return task;
    }

    public TaskResponse mapToTaskResponse(Task task) {
        List<TaskCommentResponse> comments = task.getComments() != null
                ? task.getComments().stream().map(this::mapToCommentResponse).collect(Collectors.toList())
                : List.of();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .positionIndex(task.getPositionIndex())
                .dueDate(task.getDueDate())
                .labels(task.getLabels())
                .estimatedHours(task.getEstimatedHours())
                .comments(comments)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public TaskCommentResponse mapToCommentResponse(TaskComment comment) {
        return TaskCommentResponse.builder()
                .id(comment.getId())
                .authorName(comment.getAuthorName())
                .authorAvatar(comment.getAuthorAvatar())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
