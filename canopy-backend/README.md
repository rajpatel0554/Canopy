# Canopy Backend — REST API Service

The backend engine for Canopy is built on Spring Boot, handling tenant isolation, user authorization (JWT), feature flag variations, user segment targeting, and evaluation rules.

---

## 🛠 Tech Stack

* **Framework**: Spring Boot 4.0.6 (Spring Web MVC, Spring Security, Spring Data JPA)
* **Java Version**: JDK 21
* **Database**: PostgreSQL (Data Persistence)
* **Migrations**: Flyway (Schema evolution and database seeding)
* **Tokens**: JWT (JSON Web Tokens via `jjwt` library)
* **Build Tool**: Maven

---

## 📁 Key Packages

All source code resides in `src/main/java/com/canopy/canopy_backend/`:
* `auth/`: User registration, authentication endpoints, security filter, and JWT utilities.
* `config/`: Configuration beans for Security (filter chain, CORS, password cryptography).
* `flag/`: Controllers, models, and repositories for managing feature flags and variations.
* `segment/`: Controllers, models, and repositories for user targeting cohorts (segments) and linked flags.
* `tenant/`: Tenant isolation and context models.

---

## 🔌 API Endpoints Summary

### Authentication
* `POST /api/auth/register` — Create a user account and setup tenant context.
* `POST /api/auth/login` — Sign in to obtain a JWT access token.

### Feature Flags
* `GET /api/flags` — List all feature flags.
* `POST /api/flags` — Create a new feature flag.
* `GET /api/flags/{key}/variations` — Fetch defined variations for a specific flag.
* `DELETE /api/flags/{key}` — Remove a feature flag.

### User Segments
* `GET /api/segments` — Fetch all user target segments.
* `POST /api/segments` — Create a new segment.
* `POST /api/segments/{id}/rules` — Add a targeting rule to an existing segment.
* `DELETE /api/segments/{id}/rules/{ruleId}` — Delete a targeting rule.
* `DELETE /api/segments/{id}` — Delete a segment.

---

## ⚙️ Development Setup

### 1. Database Configuration
Flyway migration files (`V1__create_public_schema_tables.sql`, etc.) are located in `src/main/resources/db/migration/`. 

Configure your PostgreSQL credentials in `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/canopy_db
    username: <your_username>
    password: <your_password>
```

### 2. Run API Server
Start the local server using the Maven wrapper:
```bash
./mvnw spring-boot:run
```
The server will start on port `8081` by default.

### 3. Run Integration Tests
To run unit and integration tests (verifying Spring Security constraints and flag evaluations):
```bash
./mvnw test
```
