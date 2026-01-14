import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WidgetHeader from './WidgetHeader';
import { TicketList } from './TicketList';
import NewTicketForm from './NewTicketForm';
import ChatView from './ChatView';

export default function CustomerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat' | 'new'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const [newMessage, setNewMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const mockTickets = [
    {
      id: '1',
      subject: 'Issue with shipment tracking',
      status: 'open',
      last_message: '2024-01-15T10:30:00',
      unread_count: 2
    },
    {
      id: '2',
      subject: 'Question about delivery time',
      status: 'resolved',
      last_message: '2024-01-14T15:20:00',
      unread_count: 0
    }
  ];

  const mockMessages = [
    {
      id: '1',
      content: 'Hi, I need help with tracking my shipment',
      sender_type: 'customer' as const,
      sender_name: 'John Doe',
      created_at: '2024-01-15T10:00:00',
      attachments: []
    },
    {
      id: '2',
      content: "Hello! I'd be happy to help you with that. Could you provide your tracking number?",
      sender_type: 'admin' as const,
      sender_name: 'Support Team',
      created_at: '2024-01-15T10:05:00',
      attachments: []
    },
    {
      id: '3',
      content: "Sure, it's SHIP123456",
      sender_type: 'customer' as const,
      sender_name: 'John Doe',
      created_at: '2024-01-15T10:10:00',
      attachments: [
        { id: '1', file_name: 'receipt.pdf', file_url: '#' }
      ]
    }
  ];

  const handleCreateTicket = () => {
    console.log('Creating ticket:', { customerName, customerEmail, newSubject, newMessage, selectedFiles });
    alert('This will create a ticket (to be connected to backend)');
    setView('chat');
    setSelectedTicketId('1');
  };

  const handleSendMessage = () => {
    console.log('Sending message:', { newMessage, selectedFiles });
    alert('This will send a message (to be connected to backend)');
    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setView('chat');
  };

  const currentTicket = mockTickets.find(t => t.id === selectedTicketId);

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
    <div className={"fixed bottom-6 right-6 z-50 transition-all duration-300 w-96 h-[600px]"}>
      <Card className="h-full flex flex-col overflow-hidden p-0">
        <WidgetHeader
          onClose={() => setIsOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
            {view === 'list' && (
              <TicketList
                tickets={mockTickets}
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
                onBack={() => setView('list')}
              />
            )}

            {view === 'chat' && currentTicket && (
              <ChatView
                ticketSubject={currentTicket.subject}
                ticketId={currentTicket.id}
                ticketStatus={currentTicket.status}
                messages={mockMessages}
                newMessage={newMessage}
                selectedFiles={selectedFiles}
                onBack={() => setView('list')}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onFilesChange={setSelectedFiles}
              />
            )}
        </div>
      </Card>
    </div>
  );
};