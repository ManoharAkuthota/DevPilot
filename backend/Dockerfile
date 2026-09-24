# Stage 1: Build JAR using official Maven + Java 21 image
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy custom settings.xml with GCS mirror to prevent HTTP 429 rate limiting
COPY settings.xml .
COPY pom.xml .

# Copy source code and build production JAR
COPY src src
RUN mvn -s settings.xml clean package -DskipTests -B

# Stage 2: Minimal Production JRE Image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install fontconfig and libstdc++ for headless utilities
RUN apk add --no-cache fontconfig ttf-dejavu libstdc++

# Create non-root user
RUN addgroup -S devpilot && adduser -S devpilot -G devpilot
USER devpilot

# Copy compiled jar
COPY --from=builder /app/target/devpilot-backend-1.0.0.jar app.jar

# Expose backend REST port
EXPOSE 8080

# Configure JVM memory and entrypoint optimized for low-vCPU cloud containers
ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
