import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TicketCard from './TicketCard';
import type { TicketListView } from '@/lib/supabaseTypes';

interface TicketSidebarProps {
  tickets: TicketListView[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  onRefresh: () => void;
  onSearch: (query: string) => void;
  onFilterStatus: (status: string) => void;
  searchQuery: string;
  statusFilter: string;
}

export default function TicketSidebar({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onRefresh,
  onSearch,
  onFilterStatus,
  searchQuery,
  statusFilter
}: TicketSidebarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  const handleStatusChange = (value: string | null) => {
    if (value) {
      onFilterStatus(value);
    }
  };

  return (
    <div className="w-96 border-r flex flex-col h-full bg-muted/20">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Support Tickets</h1>
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </form>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 h-72">
        <div className="p-2 space-y-2">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets found</p>
            </div>
          ) : (
           tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id || ''}
                subject={ticket.subject || 'Untitled'}
                customerName={ticket.customer_name || 'Unknown'}
                customerEmail={ticket.customer_email || ''}
                status={ticket.status || 'open'}
                lastMessage={ticket.last_message_at || ''}
                messageCount={ticket.message_count || 0}
                attachmentCount={ticket.attachment_count || 0}
                isSelected={selectedTicketId === ticket.id}
                onClick={() => ticket.id && onSelectTicket(ticket.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}