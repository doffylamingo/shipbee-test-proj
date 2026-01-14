import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import FileAttachment from './FileAttachment';
import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  created_at: string;
  attachments?: Array<{
    id: string;
    file_name: string;
    file_url: string;
  }>;
}

interface ChatViewProps {
  ticketSubject: string;
  ticketId: string;
  ticketStatus: string;
  messages: Message[];
  newMessage: string;
  selectedFiles: File[];
  onBack: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onFilesChange: (files: File[]) => void;
  isLoading?: boolean;
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

export default function ChatView ({
  ticketSubject,
  ticketId,
  ticketStatus,
  messages,
  newMessage,
  selectedFiles,
  onBack,
  onMessageChange,
  onSendMessage,
  onFilesChange,
  isLoading = false
}: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const removeFile = (index: number) => {
    onFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  const addFiles = (newFiles: File[]) => {
    onFilesChange([...selectedFiles, ...newFiles]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b shrink-0">
        <Button variant="ghost" onClick={onBack} className="gap-2 mb-2">
          ← Back
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{ticketSubject}</h3>
            <p className="text-xs text-muted-foreground">Ticket #{ticketId.slice(0, 8)}</p>
          </div>
          <Badge variant={getStatusVariant(ticketStatus)} className="ml-2 shrink-0">
            {ticketStatus}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 h-72">
        <div className="p-4 space-y-3">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              senderType={msg.sender_type}
              senderName={msg.sender_name}
              createdAt={msg.created_at}
              attachments={msg.attachments}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t shrink-0">
        {selectedFiles.length > 0 && (
          <div className="mb-2">
            <FileAttachment
              files={selectedFiles}
              onRemove={removeFile}
              onAdd={addFiles}
              showUploadArea={false}
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  addFiles(Array.from(e.target.files));
                }
              }}
              className="hidden"
            />
            <Button variant="outline" size="icon" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
          </label>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={onSendMessage}
            size="icon"
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};