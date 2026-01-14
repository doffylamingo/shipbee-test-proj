import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WidgetHeader from './WidgetHeader';
import { TicketList } from './TicketList';
import NewTicketForm from './NewTicketForm';
import ChatView from './ChatView';
import { useCustomerTickets } from '@/hooks/useTickets';
import { useMessages } from '@/hooks/useMessages';
import { ticketService } from '@/services/ticketService';
import { messageService } from '@/services/messageService';
import { uploadService } from '@/services/uploadService';
import { useRealtimeMessages } from '@/hooks/useRealtime';

export default function CustomerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat' | 'new'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('customerEmail');
    const savedName = localStorage.getItem('customerName');
    if (savedEmail) setCustomerEmail(savedEmail);
    if (savedName) setCustomerName(savedName);
  }, []);

  const { tickets, refetch: refetchTickets } = useCustomerTickets(customerEmail);
  
  const { messages, refetch: refetchMessages } = useMessages(selectedTicketId);

  useRealtimeMessages(selectedTicketId, () => {
    refetchMessages();
  });

  const handleCreateTicket = async () => {
    if (!customerName || !customerEmail || !newSubject || !newMessage) {
      alert('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      let uploadedFiles: Array<{
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: number;
      }> = [];

      if (selectedFiles.length > 0) {
        uploadedFiles = await uploadService.uploadFiles(selectedFiles);
      }

      const ticket = await ticketService.createTicket({
        customerName,
        customerEmail,
        subject: newSubject,
        initialMessage: newMessage,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      localStorage.setItem('customerEmail', customerEmail);
      localStorage.setItem('customerName', customerName);

      setNewSubject('');
      setNewMessage('');
      setSelectedFiles([]);

      setSelectedTicketId(ticket.id);
      setView('chat');
      
      refetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicketId || (!newMessage.trim() && selectedFiles.length === 0)) {
      return;
    }

    setIsSending(true);
    try {
      let uploadedFiles: Array<{
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: number;
      }> = [];

      if (selectedFiles.length > 0) {
        uploadedFiles = await uploadService.uploadFiles(selectedFiles);
      }

      await messageService.sendMessage({
        ticketId: selectedTicketId,
        content: newMessage,
        senderType: 'customer',
        senderName: customerName,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      setNewMessage('');
      setSelectedFiles([]);
      
      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setView('chat');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTicketId(null);
  };

  const currentTicket = tickets.find(t => t.id === selectedTicketId);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 w-96 h-[600px]">
      <Card className="h-full flex flex-col overflow-hidden p-0 shadow-2xl">
        <WidgetHeader onClose={() => setIsOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {view === 'list' && (
            <TicketList
              tickets={tickets.map(t => ({
                id: t.id || '',
                subject: t.subject || '',
                status: t.status || 'open',
                last_message: t.last_message_at || '',
                unread_count: 0
              }))}
              onNewConversation={() => setView('new')}
              onSelectTicket={handleSelectTicket}
            />
          )}

          {view === 'new' && (
            <NewTicketForm
              customerName={customerName}
              customerEmail={customerEmail}
              subject={newSubject}
              message={newMessage}
              selectedFiles={selectedFiles}
              onCustomerNameChange={setCustomerName}
              onCustomerEmailChange={setCustomerEmail}
              onSubjectChange={setNewSubject}
              onMessageChange={setNewMessage}
              onFilesChange={setSelectedFiles}
              onSubmit={handleCreateTicket}
              onBack={handleBackToList}
              isLoading={isCreating}
            />
          )}

          {view === 'chat' && currentTicket && (
            <ChatView
              ticketSubject={currentTicket.subject || ''}
              ticketId={currentTicket.id || ''}
              ticketStatus={currentTicket.status || 'open'}
              messages={messages.map(m => ({
                id: m.id,
                content: m.content,
                sender_type: m.sender_type as 'customer' | 'admin',
                sender_name: m.sender_name,
                created_at: m.created_at || '',
                attachments: m.attachments?.map(a => ({
                  id: a.id,
                  file_name: a.file_name,
                  file_url: a.file_url
                }))
              }))}
              newMessage={newMessage}
              selectedFiles={selectedFiles}
              onBack={handleBackToList}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onFilesChange={setSelectedFiles}
              isLoading={isSending}
            />
          )}
        </div>
      </Card>
    </div>
  );
}