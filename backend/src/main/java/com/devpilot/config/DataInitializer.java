package com.devpilot.config;

import com.devpilot.entity.*;
import com.devpilot.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final GitHubProfileRepository gitHubProfileRepository;
    private final RepositoryEntityRepository repoRepository;
    private final AiChatRepository aiChatRepository;
    private final AiMessageRepository aiMessageRepository;
    private final AutomationRepository automationRepository;
    private final AutomationRunRepository automationRunRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized with demo data.");
            return;
        }

        log.info("Seeding DevPilot enterprise demo dataset...");

        // 1. Admin User
        User admin = User.builder()
                .username("admin")
                .email("admin@devpilot.io")
                .password(passwordEncoder.encode("DevPilot2025!"))
                .fullName("DevPilot Admin")
                .bio("System Administrator and Platform Orchestrator.")
                .role(Role.ROLE_ADMIN)
                .productivityScore(98)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // 2. Developer User (Alex Vance)
        User alex = User.builder()
                .username("alexvance")
                .email("alex@devpilot.io")
                .password(passwordEncoder.encode("DevPilot2025!"))
                .fullName("Alex Vance")
                .bio("Senior Full-Stack Architect building autonomous AI developer copilots and distributed microservices.")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80")
                .githubUsername("alexvance-ai")
                .portfolioUrl("https://alexvance.dev")
                .techStack("React 19, Java 21, Spring Boot 3, Tailwind CSS, Docker, Kubernetes, Ollama, Playwright, MySQL")
                .skills("Java 21:95,Spring Boot:92,React 19:90,TypeScript:88,Tailwind CSS:94,Docker & K8s:85,AI & Prompt Engineering:89")
                .productivityScore(94)
                .role(Role.ROLE_USER)
                .enabled(true)
                .build();
        alex = userRepository.save(alex);

        // 3. Seed GitHub Profile & Repositories
        GitHubProfile profile = GitHubProfile.builder()
                .user(alex)
                .username("alexvance-ai")
                .avatarUrl(alex.getAvatarUrl())
                .bio(alex.getBio())
                .publicRepos(28)
                .followers(482)
                .following(119)
                .totalStars(1240)
                .totalForks(315)
                .contributionsCount(1894)
                .languagesJson("{\"TypeScript\": 42, \"Java\": 30, \"Python\": 16, \"Go\": 8, \"CSS\": 4}")
                .commitActivityJson("[12, 18, 24, 30, 28, 42, 38, 45, 55, 62, 58, 64, 72, 80]")
                .build();
        profile = gitHubProfileRepository.save(profile);

        List<RepositoryEntity> repos = List.of(
                RepositoryEntity.builder()
                        .profile(profile)
                        .name("devpilot-core-dashboard")
                        .fullName("alexvance-ai/devpilot-core-dashboard")
                        .description("High-performance AI developer copilot dashboard with glassmorphism UI.")
                        .htmlUrl("https://github.com/alexvance-ai/devpilot-core-dashboard")
                        .language("Java")
                        .starsCount(542)
                        .forksCount(128)
                        .openIssuesCount(3)
                        .aiSummary("Architecture uses Spring Boot 3 + React 19 with Playwright browser automation.")
                        .repoUpdatedAt(LocalDateTime.now().minusHours(2))
                        .build(),
                RepositoryEntity.builder()
                        .profile(profile)
                        .name("agentic-playwright-suite")
                        .fullName("alexvance-ai/agentic-playwright-suite")
                        .description("Playwright Java automated testing & screenshot crawler engine.")
                        .htmlUrl("https://github.com/alexvance-ai/agentic-playwright-suite")
                        .language("TypeScript")
                        .starsCount(380)
                        .forksCount(94)
                        .openIssuesCount(2)
                        .aiSummary("Headless browser orchestrator with automated visual regression testing.")
                        .repoUpdatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                RepositoryEntity.builder()
                        .profile(profile)
                        .name("ollama-copilot-engine")
                        .fullName("alexvance-ai/ollama-copilot-engine")
                        .description("Local LLM integration toolkit with fallback resilience and code generation.")
                        .htmlUrl("https://github.com/alexvance-ai/ollama-copilot-engine")
                        .language("Python")
                        .starsCount(215)
                        .forksCount(62)
                        .openIssuesCount(1)
                        .aiSummary("Local inference bridge featuring streaming prompt synthesis for Llama 3.1.")
                        .repoUpdatedAt(LocalDateTime.now().minusDays(3))
                        .build(),
                RepositoryEntity.builder()
                        .profile(profile)
                        .name("glassmorphism-tailwind-tokens")
                        .fullName("alexvance-ai/glassmorphism-tailwind-tokens")
                        .description("Curated design tokens for dark modern cybernetic web applications.")
                        .htmlUrl("https://github.com/alexvance-ai/glassmorphism-tailwind-tokens")
                        .language("TypeScript")
                        .starsCount(103)
                        .forksCount(31)
                        .openIssuesCount(0)
                        .aiSummary("Zero-runtime glassmorphic CSS utilities with high GPU performance.")
                        .repoUpdatedAt(LocalDateTime.now().minusDays(5))
                        .build()
        );
        repoRepository.saveAll(repos);

        // 4. Seed Kanban Tasks
        Task t1 = Task.builder()
                .user(alex)
                .title("Architect Microservice Event Bus")
                .description("Design and benchmark Kafka/RabbitMQ asynchronous event streaming for telemetry data ingestion.")
                .status(Task.Status.TODO)
                .priority(Task.Priority.HIGH)
                .positionIndex(0)
                .dueDate(LocalDate.now().plusDays(4))
                .labels("Architecture,Backend,P1")
                .estimatedHours(12.0)
                .build();

        Task t2 = Task.builder()
                .user(alex)
                .title("Setup Virtual Threads in Spring Boot 3")
                .description("Benchmark throughput under 10k concurrent websocket connections using Java 21 Project Loom.")
                .status(Task.Status.TODO)
                .priority(Task.Priority.MEDIUM)
                .positionIndex(1)
                .dueDate(LocalDate.now().plusDays(6))
                .labels("Performance,Java21")
                .estimatedHours(6.0)
                .build();

        Task t3 = Task.builder()
                .user(alex)
                .title("Build Glassmorphism Dashboard Layout")
                .description("Implement neon purple/blue gradient backgrounds, glowing borders, and Framer Motion transitions.")
                .status(Task.Status.IN_PROGRESS)
                .priority(Task.Priority.URGENT)
                .positionIndex(0)
                .dueDate(LocalDate.now().plusDays(1))
                .labels("Frontend,UI/UX,Sprint-4")
                .estimatedHours(8.0)
                .build();

        Task t4 = Task.builder()
                .user(alex)
                .title("Ollama Llama 3.1 Prompt Orchestration")
                .description("Craft context-aware prompt templates for bug detection, SQL tuning, and Spring Boot code generation.")
                .status(Task.Status.IN_PROGRESS)
                .priority(Task.Priority.HIGH)
                .positionIndex(1)
                .dueDate(LocalDate.now().plusDays(2))
                .labels("AI,Ollama,LLM")
                .estimatedHours(10.0)
                .build();

        Task t5 = Task.builder()
                .user(alex)
                .title("Playwright Java Headless Runner Service")
                .description("Implement browser session manager, DOM element clickers, and high-DPI viewport screen capturing.")
                .status(Task.Status.REVIEW)
                .priority(Task.Priority.MEDIUM)
                .positionIndex(0)
                .dueDate(LocalDate.now().plusDays(2))
                .labels("Automation,Playwright")
                .estimatedHours(5.0)
                .build();

        Task t6 = Task.builder()
                .user(alex)
                .title("JWT Refresh Token Rotation & Spring Security 6")
                .description("Implement HMAC-SHA256 token verification, blacklist revocation, and CORS pre-flight validation.")
                .status(Task.Status.DONE)
                .priority(Task.Priority.URGENT)
                .positionIndex(0)
                .dueDate(LocalDate.now().minusDays(1))
                .labels("Security,Auth,Complete")
                .estimatedHours(14.0)
                .build();

        List<Task> savedTasks = taskRepository.saveAll(List.of(t1, t2, t3, t4, t5, t6));

        // Add Comments to Task 3 & 4
        TaskComment c1 = TaskComment.builder()
                .task(savedTasks.get(2))
                .authorName("DevPilot Bot")
                .authorAvatar("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80")
                .content("Framer motion layout animations benchmarks look incredible: 60 FPS verified across Chrome and Firefox.")
                .build();

        TaskComment c2 = TaskComment.builder()
                .task(savedTasks.get(3))
                .authorName("Alex Vance")
                .authorAvatar(alex.getAvatarUrl())
                .content("Integrated local Llama 3.1 fallback pipeline. Tests responding in < 25ms.")
                .build();

        commentRepository.saveAll(List.of(c1, c2));

        // 5. Seed AI Chat History
        AiChat chat1 = AiChat.builder()
                .user(alex)
                .title("Refactor Auth Middleware")
                .categoryTemplate("REFACTOR")
                .build();
        chat1 = aiChatRepository.save(chat1);

        AiMessage m1 = AiMessage.builder()
                .chat(chat1)
                .role("user")
                .content("How should we refactor our Spring Security 6 filter chain to minimize latency?")
                .build();

        AiMessage m2 = AiMessage.builder()
                .chat(chat1)
                .role("assistant")
                .content("""
                        ### ⚡ Optimized Security Filter Chain Architecture
                        To achieve sub-millisecond filter execution:
                        1. Cache parsed claims in `SecurityContext`
                        2. Bypass unnecessary filters for public `/api/system/metrics` endpoints
                        3. Utilize `SessionCreationPolicy.STATELESS`
                        """)
                .codeLanguage("java")
                .build();

        aiMessageRepository.saveAll(List.of(m1, m2));

        // 6. Seed Automations
        Automation auto1 = Automation.builder()
                .user(alex)
                .name("Production Health Screenshot Checker")
                .description("Navigates to production landing page, checks status 200, and takes high-res screenshot.")
                .targetUrl("https://github.com")
                .actionType("SCREENSHOT_CAPTURE")
                .status(Automation.Status.ACTIVE)
                .scheduleCron("0 0 * * *")
                .build();
        auto1 = automationRepository.save(auto1);

        AutomationRun run1 = AutomationRun.builder()
                .automation(auto1)
                .status(AutomationRun.Status.SUCCESS)
                .screenshotUrl("/screenshots/sample_preview.png")
                .capturedTitle("GitHub: Let's build from here")
                .logs("[Playwright] Navigated to https://github.com in 320ms. Status 200 OK. Screenshot captured.")
                .durationMs(420L)
                .build();
        automationRunRepository.save(run1);

        log.info("Demo data seeding completed successfully! Ready for login with alex@devpilot.io / DevPilot2025!");
    }
}
