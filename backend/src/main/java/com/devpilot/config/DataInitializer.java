package com.devpilot.config;

import com.devpilot.entity.*;
import com.devpilot.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public void run(String... args) {
        log.info("Synchronizing DevPilot system profiles and Manohar Akuthota developer dataset...");

        // 1. Admin User
        User admin = userRepository.findByUsername("admin")
                .or(() -> userRepository.findByEmail("admin@devpilot.io"))
                .orElse(null);

        if (admin == null) {
            admin = User.builder()
                    .username("admin")
                    .email("admin@devpilot.io")
                    .password(passwordEncoder.encode("DevPilot2025!"))
                    .fullName("DevPilot Admin")
                    .bio("System Administrator and Platform Orchestrator.")
                    .role(Role.ROLE_ADMIN)
                    .productivityScore(98)
                    .enabled(true)
                    .build();
            admin = userRepository.save(admin);
        } else {
            admin.setPassword(passwordEncoder.encode("DevPilot2025!"));
            admin = userRepository.save(admin);
        }

        // 2. Developer User (Manohar Akuthota)
        User manohar = userRepository.findByUsername("manohar")
                .or(() -> userRepository.findByEmail("manohar@devpilot.io"))
                .or(() -> userRepository.findByUsername("alexvance"))
                .or(() -> userRepository.findByEmail("alex@devpilot.io"))
                .orElse(null);

        if (manohar == null) {
            manohar = User.builder()
                    .username("manohar")
                    .email("manohar@devpilot.io")
                    .password(passwordEncoder.encode("DevPilot2025!"))
                    .fullName("Manohar Akuthota")
                    .bio("Full-Stack & AI Software Engineer specializing in Java, Spring Boot 3, React 19, Python, TiDB Cloud, and Autonomous AI Developer Agents.")
                    .avatarUrl("https://avatars.githubusercontent.com/u/171120476?v=4")
                    .githubUsername("ManoharAkuthota")
                    .portfolioUrl("https://github.com/ManoharAkuthota")
                    .techStack("Java 21, Spring Boot 3, React 19, Python, TiDB Cloud, Docker, TypeScript, Tailwind CSS, Playwright, Machine Learning")
                    .skills("Java 21 & Spring Boot:95,React 19 & Next.js:92,Python & AI/ML:88,Cloud Databases (TiDB/MySQL):92,Docker & CI/CD:88,System Architecture:94")
                    .productivityScore(96)
                    .role(Role.ROLE_USER)
                    .enabled(true)
                    .build();
            manohar = userRepository.save(manohar);
        } else {
            // Update existing user with Manohar's profile information
            manohar.setUsername("manohar");
            manohar.setEmail("manohar@devpilot.io");
            manohar.setFullName("Manohar Akuthota");
            manohar.setBio("Full-Stack & AI Software Engineer specializing in Java, Spring Boot 3, React 19, Python, TiDB Cloud, and Autonomous AI Developer Agents.");
            manohar.setAvatarUrl("https://avatars.githubusercontent.com/u/171120476?v=4");
            manohar.setGithubUsername("ManoharAkuthota");
            manohar.setPortfolioUrl("https://github.com/ManoharAkuthota");
            manohar.setTechStack("Java 21, Spring Boot 3, React 19, Python, TiDB Cloud, Docker, TypeScript, Tailwind CSS, Playwright, Machine Learning");
            manohar.setSkills("Java 21 & Spring Boot:95,React 19 & Next.js:92,Python & AI/ML:88,Cloud Databases (TiDB/MySQL):92,Docker & CI/CD:88,System Architecture:94");
            manohar.setProductivityScore(96);
            manohar.setPassword(passwordEncoder.encode("DevPilot2025!"));
            manohar = userRepository.save(manohar);
        }

        // 3. Seed Manohar Akuthota's GitHub Profile & Repositories
        GitHubProfile profile = gitHubProfileRepository.findByUser(manohar)
                .orElse(GitHubProfile.builder().user(manohar).build());

        profile.setUsername("ManoharAkuthota");
        profile.setAvatarUrl("https://avatars.githubusercontent.com/u/171120476?v=4");
        profile.setBio("Full-Stack & AI Software Engineer specializing in Java, Spring Boot 3, React 19, Python, and Autonomous AI Developer Agents.");
        profile.setPublicRepos(16);
        profile.setFollowers(4);
        profile.setFollowing(2);
        profile.setTotalStars(48);
        profile.setTotalForks(14);
        profile.setContributionsCount(420);
        profile.setLanguagesJson("{\"Java\": 35, \"JavaScript\": 25, \"Python\": 20, \"HTML\": 12, \"CSS\": 8}");
        profile.setCommitActivityJson("[4, 8, 12, 16, 14, 22, 18, 25, 30, 28, 35, 42, 38, 45]");
        profile = gitHubProfileRepository.save(profile);

        if (profile.getRepositories().isEmpty() || profile.getRepositories().stream().noneMatch(r -> "DevPilot".equalsIgnoreCase(r.getName()))) {
            profile.getRepositories().clear();

            List<RepositoryEntity> repos = List.of(
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("DevPilot")
                            .fullName("ManoharAkuthota/DevPilot")
                            .description("Next-gen AI developer copilot dashboard & workflow orchestrator with Spring Boot 3, React 19, and TiDB Serverless.")
                            .htmlUrl("https://github.com/ManoharAkuthota/DevPilot")
                            .language("Java")
                            .starsCount(18)
                            .forksCount(5)
                            .openIssuesCount(0)
                            .aiSummary("Production-ready AI developer copilot featuring multi-provider Google Gemini and Groq Cloud LLMs with TiDB Cloud persistence.")
                            .repoUpdatedAt(LocalDateTime.now())
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("SmartVote-AI")
                            .fullName("ManoharAkuthota/SmartVote-AI")
                            .description("AI-driven secure election & voting verification platform with biometric & facial validation.")
                            .htmlUrl("https://github.com/ManoharAkuthota/SmartVote-AI")
                            .language("Python")
                            .starsCount(12)
                            .forksCount(3)
                            .openIssuesCount(1)
                            .aiSummary("Computer vision and cryptographic voting architecture ensuring tamper-evident election security.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(1))
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("ai-job-agent")
                            .fullName("ManoharAkuthota/ai-job-agent")
                            .description("Autonomous AI agent for automated job searching, resume ATS optimization, and interview preparation.")
                            .htmlUrl("https://github.com/ManoharAkuthota/ai-job-agent")
                            .language("TypeScript")
                            .starsCount(8)
                            .forksCount(2)
                            .openIssuesCount(0)
                            .aiSummary("Autonomous LLM agent leveraging vector search and prompt engineering for tailored job applications.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(2))
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("BankingApplication")
                            .fullName("ManoharAkuthota/BankingApplication")
                            .description("Enterprise core banking architecture featuring secure transaction accounting and balance transfers.")
                            .htmlUrl("https://github.com/ManoharAkuthota/BankingApplication")
                            .language("Java")
                            .starsCount(6)
                            .forksCount(2)
                            .openIssuesCount(0)
                            .aiSummary("ACID-compliant banking microservice with double-entry ledger bookkeeping and JWT authorization.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(3))
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("Ecommerce")
                            .fullName("ManoharAkuthota/Ecommerce")
                            .description("Modern scalable full-stack e-commerce store with product catalog, cart management, and checkout.")
                            .htmlUrl("https://github.com/ManoharAkuthota/Ecommerce")
                            .language("JavaScript")
                            .starsCount(5)
                            .forksCount(1)
                            .openIssuesCount(0)
                            .aiSummary("Full-featured digital storefront with responsive product filtering, cart state management, and payment checkout.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(4))
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("Drowsiness_Detection")
                            .fullName("ManoharAkuthota/Drowsiness_Detection")
                            .description("Computer vision & machine learning driver safety detection with OpenCV and eye aspect ratio analysis.")
                            .htmlUrl("https://github.com/ManoharAkuthota/Drowsiness_Detection")
                            .language("Python")
                            .starsCount(9)
                            .forksCount(3)
                            .openIssuesCount(0)
                            .aiSummary("Real-time facial landmark detection tracking blink frequency to avert distracted or drowsy driving.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(5))
                            .build(),
                    RepositoryEntity.builder()
                            .profile(profile)
                            .name("Portfolio")
                            .fullName("ManoharAkuthota/Portfolio")
                            .description("Modern interactive developer portfolio website showcasing engineering projects and live demos.")
                            .htmlUrl("https://github.com/ManoharAkuthota/Portfolio")
                            .language("HTML")
                            .starsCount(4)
                            .forksCount(1)
                            .openIssuesCount(0)
                            .aiSummary("Responsive portfolio highlighting full-stack engineering achievements, system designs, and live deployments.")
                            .repoUpdatedAt(LocalDateTime.now().minusDays(6))
                            .build()
            );
            repoRepository.saveAll(repos);
        }

        // 4. Seed Kanban Tasks for Manohar
        if (taskRepository.count() == 0 || taskRepository.findByUser(manohar).isEmpty()) {
            Task t1 = Task.builder()
                    .user(manohar)
                    .title("Deploy DevPilot on Render with TiDB Cloud Serverless")
                    .description("Configured Spring Boot 3 Docker runtime on Render with TiDB Serverless Cloud database in Singapore region.")
                    .status(Task.Status.DONE)
                    .priority(Task.Priority.URGENT)
                    .positionIndex(0)
                    .dueDate(LocalDate.now().minusDays(1))
                    .labels("Cloud,DevOps,TiDB")
                    .estimatedHours(6.0)
                    .build();

            Task t2 = Task.builder()
                    .user(manohar)
                    .title("Integrate Google Gemini 1.5 Flash & Groq Cloud LLM")
                    .description("Added multi-provider AI copilot gateway supporting Gemini 1.5 Flash and Groq Llama 3.3 with 1-click free API keys.")
                    .status(Task.Status.DONE)
                    .priority(Task.Priority.HIGH)
                    .positionIndex(1)
                    .dueDate(LocalDate.now().minusDays(1))
                    .labels("AI,Gemini,Groq")
                    .estimatedHours(8.0)
                    .build();

            Task t3 = Task.builder()
                    .user(manohar)
                    .title("Build SmartVote-AI Facial Verification Pipeline")
                    .description("Integrate OpenCV and DeepFace pipelines to authenticate voters securely with biometric liveness checks.")
                    .status(Task.Status.IN_PROGRESS)
                    .priority(Task.Priority.HIGH)
                    .positionIndex(0)
                    .dueDate(LocalDate.now().plusDays(2))
                    .labels("AI/ML,Python,SmartVote")
                    .estimatedHours(10.0)
                    .build();

            Task t4 = Task.builder()
                    .user(manohar)
                    .title("Train Drowsiness Detection Eye-Aspect-Ratio Model")
                    .description("Optimize real-time camera inference speed on Raspberry Pi / edge devices with OpenCV facial landmarks.")
                    .status(Task.Status.TODO)
                    .priority(Task.Priority.MEDIUM)
                    .positionIndex(0)
                    .dueDate(LocalDate.now().plusDays(5))
                    .labels("ComputerVision,Python")
                    .estimatedHours(12.0)
                    .build();

            Task t5 = Task.builder()
                    .user(manohar)
                    .title("Setup Automated CI/CD for Banking Application")
                    .description("Configure GitHub Actions workflow for automated Maven testing, JaCoCo code coverage, and Docker push.")
                    .status(Task.Status.TODO)
                    .priority(Task.Priority.MEDIUM)
                    .positionIndex(1)
                    .dueDate(LocalDate.now().plusDays(6))
                    .labels("CI/CD,Java,Spring")
                    .estimatedHours(5.0)
                    .build();

            List<Task> savedTasks = taskRepository.saveAll(List.of(t1, t2, t3, t4, t5));

            TaskComment c1 = TaskComment.builder()
                    .task(savedTasks.get(0))
                    .authorName("DevPilot Bot")
                    .authorAvatar("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80")
                    .content("TiDB Serverless TLS 1.3 connection verified: 0 connection drops recorded.")
                    .build();

            TaskComment c2 = TaskComment.builder()
                    .task(savedTasks.get(1))
                    .authorName("Manohar Akuthota")
                    .authorAvatar(manohar.getAvatarUrl())
                    .content("Gemini 1.5 Flash and Groq Cloud endpoints verified with automated JUnit test suites.")
                    .build();

            commentRepository.saveAll(List.of(c1, c2));
        }

        // 5. Seed Manohar's AI Chat History
        if (aiChatRepository.count() == 0 || aiChatRepository.findByUserOrderByUpdatedAtDesc(manohar).isEmpty()) {
            AiChat chat1 = AiChat.builder()
                    .user(manohar)
                    .title("TiDB Serverless High-Concurrency Tuning")
                    .categoryTemplate("SQL_HELPER")
                    .build();
            chat1 = aiChatRepository.save(chat1);

            AiMessage m1 = AiMessage.builder()
                    .chat(chat1)
                    .role("user")
                    .content("How should we index high-throughput task and user tables in TiDB Cloud Serverless?")
                    .build();

            AiMessage m2 = AiMessage.builder()
                    .chat(chat1)
                    .role("assistant")
                    .content("""
                            ### 🗄️ TiDB Cloud Serverless Indexing Architecture

                            For distributed TiKV storage engines:
                            1. **Composite Clustered Index**: Utilize `(user_id, status, created_at)` to enable Point-Get queries.
                            2. **FORCE INDEX**: Direct execution plan to avoid full table scans across distributed regions.
                            3. **Connection Pooling**: Configure HikariCP with `minimumIdle: 2`, `maximumPoolSize: 10` for serverless sleep efficiency.
                            """)
                    .codeLanguage("sql")
                    .build();

            aiMessageRepository.saveAll(List.of(m1, m2));
        }

        // 6. Seed Automations
        if (automationRepository.count() == 0 || automationRepository.findByUserOrderByCreatedAtDesc(manohar).isEmpty()) {
            Automation auto1 = Automation.builder()
                    .user(manohar)
                    .name("DevPilot Production Health & UI Snapshot")
                    .description("Navigates to DevPilot production landing page, checks status 200, and captures high-res screenshot.")
                    .targetUrl("https://github.com/ManoharAkuthota/DevPilot")
                    .actionType("SCREENSHOT_CAPTURE")
                    .status(Automation.Status.ACTIVE)
                    .scheduleCron("0 0 * * *")
                    .build();
            auto1 = automationRepository.save(auto1);

            AutomationRun run1 = AutomationRun.builder()
                    .automation(auto1)
                    .status(AutomationRun.Status.SUCCESS)
                    .screenshotUrl("/screenshots/sample_preview.png")
                    .capturedTitle("ManoharAkuthota/DevPilot: Next-Gen AI Developer Copilot")
                    .logs("[Playwright] Navigated to https://github.com/ManoharAkuthota/DevPilot in 280ms. Status 200 OK. Snapshot captured.")
                    .durationMs(390L)
                    .build();
            automationRunRepository.save(run1);
        }

        log.info("Manohar Akuthota's data integration completed! Ready for login with manohar@devpilot.io / DevPilot2025!");
    }
}
