# Stage 1: Build JAR using Maven and Java 21
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven Wrapper & Pom
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw* .

RUN chmod +x mvnw

# Cache dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package
COPY src src
RUN ./mvnw clean package -DskipTests

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

# Configure JVM memory and entrypoint
ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseG1GC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
