# 📊 CyberGrade — Complete Mermaid Diagrams Reference

This document contains all 6 architecture, process, security, and ranking diagrams converted directly into executable **Mermaid** code blocks.

---

## 1. 🏗️ Diagram 1: System Design Flowchart

```mermaid
graph LR
    subgraph S1 ["01. USER AUTH"]
        A["🔒 User Auth Portal<br/>Instructor & Admin Login<br/>WebAuthn / Passkey / 2FA"]
    end

    subgraph S2 ["02. GRADE ENTRY"]
        B["📝 Grade Entry Matrix<br/>Raw Score Input<br/>Prelim, Midterm, Final Marks"]
    end

    subgraph S3 ["03. EXCEL ENGINE"]
        C["🧮 Excel Processing Engine<br/>Automated Grade Computation<br/>Weighted Addition & Transmutation"]
    end

    subgraph S4 ["04. SECURITY & AUDIT"]
        D["🛡️ Security & Ranking Engine<br/>Immutable Audit Log Entry<br/>RANK.EQ Class Ranking"]
    end

    subgraph S5 ["05. DATA SYNC & VIEW"]
        E["☁️ Data Sync & Student Portal<br/>Google Sheets API v4 Sync<br/>Real-Time Student Grade View"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
```

---

## 2. 🗄️ Diagram 2: Database ERD Diagram

```mermaid
erDiagram
    %% Auth & Core Layer
    USERS {
        bigint id PK
        string name
        string email UK
        string role
        string profile_id
        text two_factor_secret
        string password
    }

    STUDENTS {
        bigint id PK
        string student_id UK
        string name
        string grade_level
        string section
        string school_year
        string status
        string google_sheet_id
    }

    INSTRUCTORS {
        bigint id PK
        string instructor_id UK
        string name
        string email UK
        string status
        string google_sheet_id
    }

    %% Academic Core Layer
    SUBJECTS {
        bigint id PK
        string subject_code UK
        string subject_name
        string password
    }

    SECTIONS {
        bigint id PK
        string section_name
        string grade_level
        string school_year
    }

    ASSIGNMENTS {
        bigint id PK
        string instructor_id FK
        string subject_id FK
        string section_id FK
        string school_year
    }

    GRADES {
        bigint id PK
        string student_id FK
        string subject_id FK
        string instructor_id FK
        string section_id
        decimal prelim
        decimal midterm
        decimal final
        decimal final_average
        string status
    }

    %% Operations & Audit Layer
    AUDIT_LOGS {
        bigint id PK
        string user_id FK
        string user_name
        string role
        string action
        decimal old_prelim
        decimal new_prelim
        decimal old_midterm
        decimal new_midterm
        decimal old_final
        decimal new_final
        decimal old_average
        decimal new_average
        string ip_address
    }

    SYNC_LOGS {
        bigint id PK
        string direction
        string record_type
        string status
        int records_count
        text details
        text error_message
    }

    %% Relationships
    INSTRUCTORS ||--o{ ASSIGNMENTS : "assigned to"
    SUBJECTS ||--o{ ASSIGNMENTS : "included in"
    SECTIONS ||--o{ ASSIGNMENTS : "contains"
    STUDENTS ||--o{ GRADES : "receives"
    SUBJECTS ||--o{ GRADES : "graded for"
    USERS ||--o{ AUDIT_LOGS : "performs"
```

---

## 3. 🛡️ Diagram 3: Security Architecture & RBAC

```mermaid
graph TD
    subgraph T1 ["Tier 1: Multi-Factor Identity & Auth Tier"]
        T1_1["🔑 FIDO2 / WebAuthn Hardware Passkeys"]
        T1_2["📲 TOTP Authenticator Apps (Google / Authy 2FA)"]
        T1_3["🔒 BCrypt Password Hashing"]
        T1_4["🛡️ CSRF Token & Session Guards"]
    end

    subgraph T2 ["Tier 2: Role-Based Access Control (RBAC) Tier"]
        R_ADMIN["👑 ADMIN<br/>User Provisioning, System Config,<br/>Full Audit Access, Sheet Sync Trigger"]
        R_INST["👨‍🏫 INSTRUCTOR<br/>Raw Score Entry (Prelim, Midterm, Final),<br/>Passcode Unlock Verification"]
        R_STUD["👨‍🎓 STUDENT<br/>Read-Only Personal Grade Card,<br/>Transmuted GPA Score, Section Rank"]
    end

    subgraph T3 ["Tier 3: Data Protection & Verification Tier"]
        T3_1["🔐 Subject Passcode Verification Lock"]
        T3_2["🧮 Automated Excel Formula Engine"]
        T3_3["🛡️ PDO Parameterized Queries (SQLi Guard)"]
        T3_4["🧼 XSS Input Sanitization Filters"]
    end

    subgraph T4 ["Tier 4: Tamper-Evident Audit & Compliance Tier"]
        T4_LOG["📜 Real-Time Audit Logger Engine"]
        T4_DATA["Captures: User ID, User Name, Role, Action Type,<br/>IP Address, Timestamp & Exact Score Diffs<br/>(old_prelim ➔ new_prelim, old_avg ➔ new_avg)"]
        T4_LOG --- T4_DATA
    end

    T1 ==> T2
    T2 ==> T3
    T3 ==> T4
```

---

## 4. 🧮 Diagram 4: Grade Computation Pipeline

```mermaid
flowchart LR
    subgraph STEP1 ["Step 1: Raw Scores Input Card"]
        S1_A["Prelim (30% weight)"]
        S1_B["Midterm (30% weight)"]
        S1_C["Final (40% weight)"]
        S1_V["Score Range Validation:<br/>0.00 – 100.00"]
    end

    subgraph STEP2 ["Step 2: Excel Calculation Engine Card"]
        S2_A["Weighted Addition:<br/><code>=(C2*0.30) + (D2*0.30) + (E2*0.40)</code>"]
        S2_B["Excel SUMPRODUCT:<br/><code>=SUMPRODUCT(C2:E2, $C$1:$E$1)</code>"]
        S2_C["Missing Score Guard:<br/><code>=IF(COUNTA(C2:E2)=0, 'Pending', ROUND(SUM(C2:E2)/COUNTA(C2:E2), 2))</code>"]
    end

    subgraph STEP3 ["Step 3: Grade Transmutation & GPA Lookup Card"]
        S3_MAP["IFS Transmutation Mapping Table:<br/>97–100% ➔ 1.00 (A+)<br/>93–96% ➔ 1.25 (A)<br/>89–92% ➔ 1.50 (A-)<br/>85–88% ➔ 1.75 (B+)<br/>80–84% ➔ 2.00 (B)<br/>75–79% ➔ 2.50 (C)<br/>70–74% ➔ 3.00 (D)<br/>&lt;70% ➔ 5.00 (F)"]
        S3_F["Formula:<br/><code>=IFS(F2>=97, 1.00, F2>=93, 1.25, ..., TRUE, 5.00)</code>"]
    end

    subgraph STEP4 ["Step 4: Final Evaluation & Status Output Card"]
        S4_AVG["Computed Final Average & GPA Mark"]
        S4_STATUS["Pass/Fail Status Badge:<br/><code>=IF(F2>=75, 'PASSED', 'FAILED')</code>"]
        S4_B1["🟩 PASSED Badge (≥ 75.00)"]
        S4_B2["🟥 FAILED Badge (&lt; 70.00)"]
        S4_B3["🟨 PENDING Badge (Missing Marks)"]
    end

    STEP1 ==> STEP2
    STEP2 ==> STEP3
    STEP3 ==> STEP4
```

---

## 5. 🏆 Diagram 5: Ranking Engine Flowchart

```mermaid
flowchart TD
    C1["📊 Card 1: Grade Data Extraction<br/>Class Final Averages Column Input Range<br/><code>$F$2:$F$51</code>"]

    C2["🔢 Card 2: Standard Competition Ranking<br/>Formula: <code>=RANK.EQ(F2, $F$2:$F$51, 0)</code><br/>Assigns initial positions (1st, 2nd, 3rd...) in descending order"]

    C3["⚖️ Card 3: Automated Tie-Breaking Logic<br/>Handles identical average ties using secondary Final Exam metric<br/>Formula: <code>=RANK.EQ(F2, $F$2:$F$51, 0) + COUNTIFS($F$2:$F$51, F2, $E$2:$E$51, '&gt;'&E2)</code>"]

    C4["⭐ Card 4: Honors List Extraction Array<br/>Dynamic Top Student Array Formula:<br/><code>=CHOOSEROWS(SORT(FILTER(A2:F51, F2:F51>=90), 6, -1), SEQUENCE(MIN(10, COUNTA(FILTER(A2:A51, F2:F51>=90)))))</code>"]

    C5["🏆 Card 5: Leaderboard & Honor Roll Presentation<br/>🥇 1st Place (Gold Badge)<br/>🥈 2nd Place (Silver Badge)<br/>🥉 3rd Place (Bronze Badge)<br/>Dean's Honor Roll Listing"]

    C1 ==> C2
    C2 ==> C3
    C3 ==> C4
    C4 ==> C5
```

---

## 6. 🌐 Diagram 6: Complete System Architecture Overview

```mermaid
graph TD
    %% Central Hub
    HUB(("⚙️ CyberGrade Core System Hub"))

    %% Quadrant 1
    subgraph Q1 ["📱 Quadrant 1: Presentation & Auth Layer"]
        direction TB
        UI["Vue 3 / Inertia.js Web UI"]
        AUTH["FIDO2 / WebAuthn Passkeys & 2FA TOTP Engine"]
        ROLES["Role Dashboards<br/>(Admin, Dean, Instructor, Student)"]
        UI --> AUTH
        UI --> ROLES
    end

    %% Quadrant 2
    subgraph Q2 ["⚙️ Quadrant 2: Core Processing Engine"]
        direction TB
        API["Laravel 11 Backend API"]
        EXCEL["Excel Formula Execution Module<br/>(SUMPRODUCT, IFS, ROUND)"]
        LOCK["Security Subject Passcode Lock"]
        AUDIT_ENG["Audit Trail Logger"]
        RANK["RANK.EQ Ranking Engine"]
        API --> EXCEL
        API --> LOCK
        API --> AUDIT_ENG
        API --> RANK
    end

    %% Quadrant 3
    subgraph Q3 ["💾 Quadrant 3: Storage & Cloud Integration"]
        direction TB
        DB[("MySQL Database<br/>(9 Relational Tables)")]
        GSYNC["Google Sheets API v4<br/>Bi-directional Sync Service"]
        DB <--> GSYNC
    end

    %% Quadrant 4
    subgraph Q4 ["📊 Quadrant 4: Analytics & Output Deliverables"]
        direction TB
        CARDS["Real-Time Student Grade Cards"]
        LEADER["Section & Department Leaderboards"]
        REPORTS["System Audit History Log Reports"]
        SHEETS["Exported Cloud Spreadsheets"]
    end

    %% Central Connections
    Q1 ==>|"1. User Action & Auth"| HUB
    HUB ==>|"2. Dispatch Request"| Q2
    Q2 ==>|"3. Process Formulas & Audit"| HUB
    HUB ==>|"4. Store / Sync Records"| Q3
    Q3 ==>|"5. Fetch Data"| HUB
    HUB ==>|"6. Generate Output"| Q4
    Q4 -. "7. Render to View" .-> UI
```
