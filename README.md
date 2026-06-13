# Canopy — Feature Flagging & User Segmentation Platform

Canopy is a high-performance, open-source Feature Flagging and User Segmentation platform. It enables product and engineering teams to toggle features in real-time, target user cohorts via dynamic targeting rules, and evaluate flag variations with minimal latency (<10ms).

---

## 🚀 Key Features

* **Feature Flags Management**: Create, edit, toggle, and delete feature flags supporting Boolean, String, Number, and JSON variation configurations.
* **Targeting & Segments**: Build complex user cohorts (Segments) based on custom targeting rules (e.g., matching user attributes and environment values).
* **API Keys Dashboard**: Securely generate, filter, and revoke API keys. Features a secure `.env` key-reveal modal card and dynamic credentials downloader.
* **State Persistence**: Real-time synchronization between the database and the dashboard, with offline local-storage fallback for credentials testing.
* **Baseline Security**: Enforces secure password hashing via BCrypt, parameterised queries to prevent SQL injection, and robust HTTP security headers (CSP, HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff).

---

## 🛠 Tech Stack

* **Frontend**: Next.js App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, and NextAuth.js.
* **Backend**: Spring Boot 4.0, Java 21, Spring Data JPA, Spring Security, JWT token validation, Flyway database migrations.
* **Database**: PostgreSQL.

---

## 📁 Project Structure

```
Canopy/
├── canopy-frontend/       # Next.js web application (Dashboard UI)
├── canopy-backend/        # Spring Boot REST API (Core Business Logic)
└── README.md              # Global project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
* **Java SDK 21** or higher
* **Node.js** (v18.x or higher)
* **PostgreSQL** database service running locally

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd canopy-backend
   ```
2. Configure your database details inside `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/canopy_db
       username: <your_username>
       password: <your_password>
   ```
3. Run the Spring Boot application (Flyway migrations will run automatically on startup to seed the database schemas):
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will start on `http://localhost:8081`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../canopy-frontend
   ```
2. Create your environment configuration file `.env.local`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=canopy-local-development-secret-32-characters-long
   NEXT_PUBLIC_API_URL=http://localhost:8081
   ```
3. Install dependencies and start the Next.js development server:
   ```bash
   npm install
   npm run dev
   ```
   The dashboard UI will start on `http://localhost:3000`.

---

## 🧪 Running Tests

### Backend Tests
To run Java unit and integration tests (including REST API context evaluations):
```bash
cd canopy-backend
./mvnw test
```

### Frontend Code Quality
To run TypeScript linter verification check:
```bash
cd canopy-frontend
npm run lint
```
