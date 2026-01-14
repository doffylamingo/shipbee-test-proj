import { supabase } from '@/lib/supabase';
import type { Message, Attachment } from '@/lib/supabaseTypes';

export interface MessageWithAttachments extends Message {
  attachments: Attachment[];
}

export interface SendMessageData {
  ticketId: string;
  content: string;
  senderType: 'customer' | 'admin';
  senderName: string;
  attachments?: Array<{
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }>;
}

export const messageService = {
  async getMessagesByTicket(ticketId: string): Promise<MessageWithAttachments[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          attachments (*)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MessageWithAttachments[] || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  },

  async sendMessage(messageData: SendMessageData): Promise<MessageWithAttachments> {
    try {
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: messageData.ticketId,
          content: messageData.content,
          sender_type: messageData.senderType,
          sender_name: messageData.senderName
        })
        .select()
        .single();

      if (messageError) throw messageError;

      let attachments: Attachment[] = [];
      if (messageData.attachments && messageData.attachments.length > 0) {
        const attachmentInserts = messageData.attachments.map(att => ({
          message_id: message.id,
          file_name: att.file_name,
          file_url: att.file_url,
          file_type: att.file_type,
          file_size: att.file_size
        }));

        const { data: createdAttachments, error: attachmentError } = await supabase
          .from('attachments')
          .insert(attachmentInserts)
          .select();

        if (attachmentError) throw attachmentError;
        attachments = createdAttachments || [];
      }

      return {
        ...message,
        attachments
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  subscribeToMessages(
    ticketId: string,
    callback: (message: MessageWithAttachments) => void
  ) {
    const channel = supabase
      .channel(`messages:${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${ticketId}`
        },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              attachments (*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            callback(data as MessageWithAttachments);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};