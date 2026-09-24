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
        assertTrue(userRepository.existsByEmail("manohar@devpilot.io"));

        // Test primary login with Manohar credentials
        LoginRequest manoharLogin = new LoginRequest();
        manoharLogin.setUsernameOrEmail("manohar@devpilot.io");
        manoharLogin.setPassword("DevPilot2025!");

        var manoharResponse = authService.login(manoharLogin);
        assertNotNull(manoharResponse.getAccessToken());
        assertNotNull(manoharResponse.getRefreshToken());
        assertEquals("manohar", manoharResponse.getUser().getUsername());

        // Test alias login with Alex credentials
        LoginRequest alexLogin = new LoginRequest();
        alexLogin.setUsernameOrEmail("alex@devpilot.io");
        alexLogin.setPassword("DevPilot2025!");

        var alexResponse = authService.login(alexLogin);
        assertNotNull(alexResponse.getAccessToken());
        assertEquals("manohar", alexResponse.getUser().getUsername());
    }
}
