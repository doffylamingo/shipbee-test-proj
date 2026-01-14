import { supabase } from '@/lib/supabase';
import type { Customer, Ticket, TicketListView } from '@/lib/supabaseTypes';

export interface CreateTicketData {
  customerName: string;
  customerEmail: string;
  subject: string;
  initialMessage: string;
  attachments?: Array<{
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }>;
}

export const ticketService = {
 
  async getAllTickets(): Promise<TicketListView[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_list_view')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  },


  async getTicketsByCustomer(email: string): Promise<TicketListView[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_list_view')
        .select('*')
        .eq('customer_email', email)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer tickets:', error);
      throw new Error('Failed to fetch customer tickets');
    }
  },


  async getTicketById(ticketId: string): Promise<Ticket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, customers(*)')
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw new Error('Failed to fetch ticket');
    }
  },


  async createTicket(ticketData: CreateTicketData): Promise<Ticket> {
    try {
      let customer: Customer | null = null;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', ticketData.customerEmail)
        .single();

      if (existingCustomer) {
        customer = existingCustomer;
        
        if (existingCustomer.name !== ticketData.customerName) {
          const { data: updatedCustomer } = await supabase
            .from('customers')
            .update({ name: ticketData.customerName })
            .eq('id', existingCustomer.id)
            .select()
            .single();
          
          customer = updatedCustomer;
        }
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: ticketData.customerName,
            email: ticketData.customerEmail
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customer = newCustomer;
      }

      if (!customer) throw new Error('Failed to create or find customer');

      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          customer_id: customer.id,
          subject: ticketData.subject,
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          content: ticketData.initialMessage,
          sender_type: 'customer',
          sender_name: ticketData.customerName
        })
        .select()
        .single();

      if (messageError) throw messageError;

      if (ticketData.attachments && ticketData.attachments.length > 0) {
        const attachmentInserts = ticketData.attachments.map(att => ({
          message_id: message.id,
          file_name: att.file_name,
          file_url: att.file_url,
          file_type: att.file_type,
          file_size: att.file_size
        }));

        const { error: attachmentError } = await supabase
          .from('attachments')
          .insert(attachmentInserts);

        if (attachmentError) throw attachmentError;
      }

      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Failed to create ticket');
    }
  },

  async updateTicketStatus(
    ticketId: string,
    status: 'open' | 'pending' | 'resolved' | 'closed'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw new Error('Failed to update ticket status');
    }
  },

  async searchTickets(query: string): Promise<TicketListView[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_list_view')
        .select('*')
        .or(`subject.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw new Error('Failed to search tickets');
    }
  },

  async filterTicketsByStatus(status: string): Promise<TicketListView[]> {
    try {
      if (status === 'all') {
        return this.getAllTickets();
      }

      const { data, error } = await supabase
        .from('ticket_list_view')
        .select('*')
        .eq('status', status)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error filtering tickets:', error);
      throw new Error('Failed to filter tickets');
    }
  }
};