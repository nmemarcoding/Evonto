# Evonto — Event Planning & Invitation Platform

This repository contains Evonto, a full-stack event planning application with a Java Spring Boot backend and a React frontend. Evonto lets hosts create events, send invitations, and track RSVPs; guests can view invitations and respond.

This README documents the repository structure, features, quick start for development, production build and deploy guidance, API reference, environment variables, and troubleshooting tips — everything needed to run and operate the app in an industrial environment.

## Repository layout

- `backend/evonto` — Spring Boot backend (Java 21, Maven)
	- `src/main/java/com/nmemarcoding/evonto` — application code (controllers, services, models, util)
	- `src/main/resources/application.properties` — datasource and runtime configuration
	- `pom.xml` — Maven project file
	- `Dockerfile` — container image definition

# Evonto — What, Stack, How to Run (Minimal)

What is this app?
-----------------
Evonto is a small event planning and invitation platform: users register/login, create events, send invitations, and guests can view invitation details and RSVP.

Live demo
---------
Frontend (deployed): https://evento-3d336.web.app/

Tech stack
----------
- Backend: Java 21, Spring Boot (Maven), Spring Data JPA, Spring Security, JWT
- Frontend: React (Create React App), Axios, React Router, Tailwind CSS
- Database: MySQL-compatible (JDBC)

How to run locally
------------------
1) Start backend (uses included Maven wrapper):

```bash
cd backend/evonto
./mvnw spring-boot:run
```

Or build & run jar:

```bash
./mvnw clean package -DskipTests
java -jar target/evonto-0.0.1-SNAPSHOT.jar
```

2) Start frontend:

```bash
cd frontend
npm install
npm start
# open http://localhost:3000
```

Quick notes
-----------
- Set DB credentials in `backend/evonto/src/main/resources/application.properties` before running.
- For local frontend use, change `baseURL` in `frontend/src/services/apiService.js` to `http://localhost:8080/api`.

How to run tests
----------------
- Backend unit/integration tests:

```bash
cd backend/evonto
./mvnw test
```

- Frontend tests:

```bash
cd frontend
npm test
```

