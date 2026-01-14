import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import TicketSidebar from './TicketSidebar';
import ConversationPanel from './ConversationPanel';
import { useTickets } from '@/hooks/useTickets';
import { useMessages } from '@/hooks/useMessages';
import { ticketService } from '@/services/ticketService';
import { messageService } from '@/services/messageService';
import { uploadService } from '@/services/uploadService';
import { useRealtimeMessages } from '@/hooks/useRealtime';

export default function AdminDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { tickets, loading: ticketsLoading, refetch, searchTickets, filterByStatus } = useTickets();
  
  const { messages, loading: messagesLoading, refetch: refetchMessages } = useMessages(selectedTicketId);

  useRealtimeMessages(selectedTicketId, () => {
    refetchMessages();
  });

  const handleRefresh = () => {
    refetch();
    if (selectedTicketId) {
      refetchMessages();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchTickets(query);
    } else {
      refetch();
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterByStatus(status);
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedTicketId) return;
    
    try {
      await ticketService.updateTicketStatus(
        selectedTicketId, 
        status as 'open' | 'pending' | 'resolved' | 'closed'
      );
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleSendMessage = async (message: string, files: File[]) => {
    if (!selectedTicketId) return;

    try {
      let uploadedFiles: Array<{
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: number;
      }> = [];

      if (files.length > 0) {
        uploadedFiles = await uploadService.uploadFiles(files);
      }

      await messageService.sendMessage({
        ticketId: selectedTicketId,
        content: message,
        senderType: 'admin',
        senderName: 'Support Team',
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  if (ticketsLoading && tickets.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <TicketSidebar
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={setSelectedTicketId}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        onFilterStatus={handleStatusFilter}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      {selectedTicket && selectedTicket.id ? (
        <ConversationPanel
          ticketId={selectedTicket.id}
          subject={selectedTicket.subject || 'Untitled'}
          customerName={selectedTicket.customer_name || 'Unknown'}
          customerEmail={selectedTicket.customer_email || ''}
          status={selectedTicket.status || 'open'}
          createdAt={selectedTicket.created_at || new Date().toISOString()}
          messages={messages}
          messagesLoading={messagesLoading}
          onStatusChange={handleStatusChange}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Select a ticket to view conversation</p>
            <p className="text-sm mt-2">
              {tickets.length === 0 ? 'No tickets yet' : `${tickets.length} ticket${tickets.length === 1 ? '' : 's'} available`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}