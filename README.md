# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

# Database Schema (ERD)

```mermaid
erDiagram
    CUSTOMERS {
        UUID id PK
        string name
        string email "UNIQUE"
        datetime created_at
        datetime updated_at
    }

    TICKETS {
        UUID id PK
        UUID customer_id FK
        string subject
        string status
        datetime last_message_at
        datetime created_at
        datetime updated_at
    }

    MESSAGES {
        UUID id PK
        UUID ticket_id FK
        string content
        string sender_type
        string sender_name
        datetime created_at
    }

    ATTACHMENTS {
        UUID id PK
        UUID message_id FK
        string file_name
        string file_url
        string file_type
        int file_size
        datetime created_at
    }

    CUSTOMERS ||--o{ TICKETS : has
    TICKETS   ||--o{ MESSAGES : contains
    MESSAGES  ||--o{ ATTACHMENTS : includes
```


**Relationships:**

- One Customer can have many Tickets (1:N)
- One Ticket can have many Messages (1:N)
- One Message can have many Attachments (1:N)

**Enums:**

- Ticket Status: `open`, `pending`, `resolved`, `closed`
- Sender Type: `customer`, `admin`
