import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';

interface TicketCardProps {
  id: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: string;
  lastMessage: string;
  messageCount: number;
  attachmentCount: number;
  isSelected: boolean;
  onClick: () => void;
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

export default function TicketCard({
  id,
  subject,
  customerName,
  customerEmail,
  status,
  lastMessage,
  messageCount,
  attachmentCount,
  isSelected,
  onClick
}: TicketCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-colors ${
        isSelected ? 'bg-accent border-primary' : 'hover:bg-accent/50'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{subject}</h3>
            <p className="text-xs text-muted-foreground">{customerName}</p>
            <p className="text-xs text-muted-foreground truncate">{customerEmail}</p>
          </div>
          <Badge variant={getStatusVariant(status)} className="ml-2 shrink-0">
            {status}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-3">
            <span>{messageCount} messages</span>
            {attachmentCount > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {attachmentCount}
              </span>
            )}
          </div>
          <span>{new Date(lastMessage).toLocaleDateString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">#{id.slice(0, 8)}</p>
      </CardContent>
    </Card>
  );
}