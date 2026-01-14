# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

# Database Schema (ERD)

┌─────────────────────┐
│ customers │
├─────────────────────┤
│ id (PK, UUID) │
│ name │
│ email (UNIQUE) │
│ created_at │
│ updated_at │
└──────────┬──────────┘
│
│ 1:N
│
┌──────────▼──────────┐
│ tickets │
├─────────────────────┤
│ id (PK, UUID) │
│ customer_id (FK) │
│ subject │
│ status │
│ created_at │
│ updated_at │
│ last_message_at │
└──────────┬──────────┘
│
│ 1:N
│
┌──────────▼──────────┐
│ messages │
├─────────────────────┤
│ id (PK, UUID) │
│ ticket_id (FK) │
│ content │
│ sender_type │
│ sender_name │
│ created_at │
└──────────┬──────────┘
│
│ 1:N
│
┌──────────▼──────────┐
│ attachments │
├─────────────────────┤
│ id (PK, UUID) │
│ message_id (FK) │
│ file_name │
│ file_url │
│ file_type │
│ file_size │
│ created_at │
└─────────────────────┘

**Relationships:**

- One Customer can have many Tickets (1:N)
- One Ticket can have many Messages (1:N)
- One Message can have many Attachments (1:N)

**Enums:**

- Ticket Status: `open`, `pending`, `resolved`, `closed`
- Sender Type: `customer`, `admin`
