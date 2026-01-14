import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import TicketSidebar from './TicketSidebar';
import ConversationPanel from './ConversationPanel';

export default function AdminDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const mockTickets = [
    {
      id: '1',
      subject: 'Issue with shipment tracking',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      status: 'open',
      last_message_at: '2024-01-15T10:30:00',
      message_count: 5,
      attachment_count: 2,
      created_at: '2024-01-15T09:00:00'
    },
    {
      id: '2',
      subject: 'Question about delivery time',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      status: 'pending',
      last_message_at: '2024-01-14T15:20:00',
      message_count: 3,
      attachment_count: 0,
      created_at: '2024-01-14T14:00:00'
    },
    {
      id: '3',
      subject: 'Damaged package received',
      customer_name: 'Bob Wilson',
      customer_email: 'bob@example.com',
      status: 'resolved',
      last_message_at: '2024-01-13T11:45:00',
      message_count: 8,
      attachment_count: 3,
      created_at: '2024-01-12T10:00:00'
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

  const handleRefresh = () => {
    console.log('Refreshing tickets...');
  };

  const handleStatusChange = (status: string) => {
    console.log('Changing status to:', status);
  };

  const handleSendMessage = (message: string, files: File[]) => {
    console.log('Sending message:', message, 'with files:', files);
  };

  const selectedTicket = mockTickets.find(t => t.id === selectedTicketId);

  return (
    <div className="flex h-screen bg-background">
      <TicketSidebar
        tickets={mockTickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={setSelectedTicketId}
        onRefresh={handleRefresh}
      />

      {selectedTicket ? (
        <ConversationPanel
          ticketId={selectedTicket.id}
          subject={selectedTicket.subject}
          customerName={selectedTicket.customer_name}
          customerEmail={selectedTicket.customer_email}
          status={selectedTicket.status}
          createdAt={selectedTicket.created_at}
          messages={mockMessages}
          onStatusChange={handleStatusChange}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Select a ticket to view conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}