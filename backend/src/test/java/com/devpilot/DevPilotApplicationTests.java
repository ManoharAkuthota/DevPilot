package com.devpilot;

import com.devpilot.dto.LoginRequest;
import com.devpilot.dto.RegisterRequest;
import com.devpilot.entity.User;
import com.devpilot.repository.UserRepository;
import com.devpilot.service.AuthService;
import com.devpilot.service.SystemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class DevPilotApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private SystemService systemService;

    @Test
    void contextLoads() {
        assertNotNull(userRepository);
        assertNotNull(authService);
        assertNotNull(systemService);
    }

    @Test
    void testSystemMetrics() {
        var metrics = systemService.getLiveMetrics();
        assertNotNull(metrics);
        assertTrue(metrics.getCpuUsagePct() >= 0);
        assertTrue(metrics.getMemoryTotalMb() > 0);
        assertNotNull(metrics.getOsName());
    }

    @Test
    void testUserSeedingAndLogin() {
        // User seeded by DataInitializer
        assertTrue(userRepository.existsByEmail("alex@devpilot.io"));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("alex@devpilot.io");
        loginRequest.setPassword("DevPilot2025!");

        var authResponse = authService.login(loginRequest);
        assertNotNull(authResponse.getAccessToken());
        assertNotNull(authResponse.getRefreshToken());
        assertEquals("alexvance", authResponse.getUser().getUsername());
    }
}
