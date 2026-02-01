# 🛡️ Incrypt – Secure Notes Taking Application

**Incrypt** is a secure, backend-driven notes taking application designed with a strong focus on **data privacy, authentication security, and clean architecture**.

It allows users to safely create, store, and manage **encrypted notes**, ensuring that sensitive information remains protected at all times.

Built using **Spring Boot**, **JWT**, **OAuth2**, and **MySQL**, Incrypt follows industry-grade security practices commonly used in real-world applications.

---

## Key Features

* **End-to-End Note Encryption**

  * Notes are encrypted before being stored in the database
  * Prevents unauthorized access even if the database is compromised

* **Secure Authentication & Authorization**

  * JWT-based stateless authentication
  * OAuth2 support for secure third-party login
  * Role-based access control (RBAC)

* **CRUD Operations on Notes**

  * Create, read, update, and delete encrypted notes
  * Notes are accessible **only to their respective owners**

* **User-Scoped Data Isolation**

  * Strict user-note ownership enforcement
  * No cross-user data leakage

* **Security Best Practices**

  * Password hashing using strong cryptographic algorithms
  * Token-based session handling
  * Secure API endpoints with authorization filters

---

## Why Incrypt?

`Incrypt` is built to demonstrate:

* Real-world **backend security implementation**

* Proper **authentication & authorization flow**

* Clean, modular Spring Boot architecture

* Production-ready coding practices

---
