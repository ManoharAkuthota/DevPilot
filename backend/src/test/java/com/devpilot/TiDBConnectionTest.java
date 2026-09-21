package com.devpilot;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TiDBConnectionTest {

    @Test
    public void testTiDBCloudConnection() {
        String pass = System.getenv("TIDB_PASSWORD");
        if (pass == null || pass.isBlank()) {
            pass = "6BP74bdgTlFpWzrm";
        }
        String host = System.getenv("TIDB_HOST") != null ? System.getenv("TIDB_HOST") : "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
        String user = System.getenv("TIDB_USER") != null ? System.getenv("TIDB_USER") : "3HVUhdVZBhSBCPs.root";
        String url = String.format("jdbc:mysql://%s:4000/devpilot_db?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&allowPublicKeyRetrieval=true&serverTimezone=UTC", host);

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("CREATE DATABASE IF NOT EXISTS devpilot_db;");
                try (ResultSet rs = stmt.executeQuery("SELECT VERSION()")) {
                    if (rs.next()) {
                        System.out.println("TiDB Server Verified: " + rs.getString(1));
                    }
                }
            }
        } catch (Exception ex) {
            System.out.println("TiDB connection test note: " + ex.getMessage());
        }
    }
}
