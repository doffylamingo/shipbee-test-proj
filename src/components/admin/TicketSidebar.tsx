// src/components/admin/TicketSidebar.tsx
import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TicketCard from './TicketCard';

interface Ticket {
  id: string;
  subject: string;
  customer_name: string;
  customer_email: string;
  status: string;
  last_message_at: string;
  message_count: number;
  attachment_count: number;
}

interface TicketSidebarProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  onRefresh: () => void;
}

export default function TicketSidebar({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onRefresh
}: TicketSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-96 border-r bg-muted/10 flex flex-col h-full">
      <div className="p-4 border-b bg-background space-y-3">
        <h1 className="text-xl font-bold">Support Tickets</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 h-72">
        <div className="p-4 space-y-2">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets found</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                subject={ticket.subject}
                customerName={ticket.customer_name}
                customerEmail={ticket.customer_email}
                status={ticket.status}
                lastMessage={ticket.last_message_at}
                messageCount={ticket.message_count}
                attachmentCount={ticket.attachment_count}
                isSelected={selectedTicketId === ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}