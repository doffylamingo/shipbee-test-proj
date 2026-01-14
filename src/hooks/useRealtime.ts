import { useEffect } from 'react';
import { messageService, type MessageWithAttachments } from '@/services/messageService';

export function useRealtimeMessages(
  ticketId: string | null,
  onNewMessage: (message: MessageWithAttachments) => void
) {
  useEffect(() => {
    if (!ticketId) return;

    const unsubscribe = messageService.subscribeToMessages(ticketId, onNewMessage);

    return () => {
      unsubscribe();
    };
  }, [ticketId, onNewMessage]);
}