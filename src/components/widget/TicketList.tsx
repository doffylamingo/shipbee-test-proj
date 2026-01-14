import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  last_message: string;
  unread_count: number;
}

interface TicketListProps {
  tickets: Ticket[];
  onNewConversation: () => void;
  onSelectTicket: (ticketId: string) => void;
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'open': return 'default';
    case 'resolved': return 'outline';
    case 'closed': return 'secondary';
    default: return 'secondary';
  }
};

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onNewConversation,
  onSelectTicket
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b shrink-0">
        <Button onClick={onNewConversation} className="w-full">
          New Conversation
        </Button>
      </div>
      <ScrollArea className="flex-1 h-72">
        <div className="p-4 space-y-2">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Start a new one!</p>
            </div>
          ) : (
            tickets.map(ticket => (
              <Card
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(ticket.last_message).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(ticket.status)} className="ml-2 shrink-0">
                      {ticket.status}
                    </Badge>
                  </div>
                  {ticket.unread_count > 0 && (
                    <Badge variant="default" className="text-xs">
                      {ticket.unread_count} new
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};