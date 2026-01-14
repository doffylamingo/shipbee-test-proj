-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'admin')),
    sender_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_last_message_at ON tickets(last_message_at DESC);
CREATE INDEX idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_attachments_message_id ON attachments(message_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at when a new message is created
CREATE OR REPLACE FUNCTION update_ticket_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tickets
    SET last_message_at = NEW.created_at
    WHERE id = NEW.ticket_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_last_message();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (For demo purposes, we'll make everything accessible)
-- In production, you'd want more restrictive policies

-- Customers: Anyone can insert (for creating new tickets), read their own data
CREATE POLICY "Enable insert for all users" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all users" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON customers
    FOR UPDATE USING (true);

-- Tickets: Anyone can read and insert
CREATE POLICY "Enable read access for all users" ON tickets
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON tickets
    FOR UPDATE USING (true);

-- Messages: Anyone can read and insert
CREATE POLICY "Enable read access for all users" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON messages
    FOR INSERT WITH CHECK (true);

-- Attachments: Anyone can read and insert
CREATE POLICY "Enable read access for all users" ON attachments
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON attachments
    FOR INSERT WITH CHECK (true);

-- Create a view for ticket list with counts
CREATE OR REPLACE VIEW ticket_list_view AS
SELECT 
    t.id,
    t.subject,
    t.status,
    t.created_at,
    t.updated_at,
    t.last_message_at,
    c.name as customer_name,
    c.email as customer_email,
    COUNT(DISTINCT m.id) as message_count,
    COUNT(DISTINCT a.id) as attachment_count
FROM tickets t
LEFT JOIN customers c ON t.customer_id = c.id
LEFT JOIN messages m ON t.id = m.ticket_id
LEFT JOIN attachments a ON m.id = a.message_id
GROUP BY t.id, t.subject, t.status, t.created_at, t.updated_at, t.last_message_at, c.name, c.email;