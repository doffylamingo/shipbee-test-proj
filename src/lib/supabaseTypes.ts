export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          customer_id: string
          subject: string
          status: 'open' | 'pending' | 'resolved' | 'closed'
          created_at: string
          updated_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          subject: string
          status?: 'open' | 'pending' | 'resolved' | 'closed'
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          subject?: string
          status?: 'open' | 'pending' | 'resolved' | 'closed'
          created_at?: string
          updated_at?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          ticket_id: string
          content: string
          sender_type: 'customer' | 'admin'
          sender_name: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          content: string
          sender_type: 'customer' | 'admin'
          sender_name: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          content?: string
          sender_type?: 'customer' | 'admin'
          sender_name?: string
          created_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_url: string
          file_type: string | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_url: string
          file_type?: string | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_url?: string
          file_type?: string | null
          file_size?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      ticket_list_view: {
        Row: {
          id: string
          subject: string
          status: string
          created_at: string
          updated_at: string
          last_message_at: string
          customer_name: string
          customer_email: string
          message_count: number
          attachment_count: number
        }
      }
    }
  }
}

export type Customer = Database['public']['Tables']['customers']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];
export type TicketListView = Database['public']['Views']['ticket_list_view']['Row'];