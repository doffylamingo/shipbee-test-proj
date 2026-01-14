import { useState, useEffect } from 'react';
import { messageService, type MessageWithAttachments } from '@/services/messageService';

export function useMessages(ticketId: string | null) {
  const [messages, setMessages] = useState<MessageWithAttachments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!ticketId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getMessagesByTicket(ticketId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticketId]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages
  };
}