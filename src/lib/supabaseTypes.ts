import type { Database } from './database.types';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];

export type TicketListView = Database['public']['Views']['ticket_list_view']['Row'];

export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type AttachmentInsert = Database['public']['Tables']['attachments']['Insert'];

export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];
export type TicketUpdate = Database['public']['Tables']['tickets']['Update'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];
export type AttachmentUpdate = Database['public']['Tables']['attachments']['Update'];

export interface MessageWithAttachments extends Message {
  attachments: Attachment[];
}

export interface TicketWithCustomer extends Ticket {
  customers: Customer;
}

export type { Database };