import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import MessageBubble from '../widget/MessageBubble';
import FileAttachment from '../widget/FileAttachment';

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

interface ConversationPanelProps {
  ticketId: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: string;
  messages: Message[];
  onStatusChange: (status: string) => void;
  onSendMessage: (message: string, files: File[]) => void;
}

export default function ConversationPanel({
  ticketId,
  subject,
  customerName,
  customerEmail,
  status,
  createdAt,
  messages,
  onStatusChange,
  onSendMessage
}: ConversationPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, selectedFiles);
      setNewMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const addFiles = (newFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4 bg-background shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{subject}</h2>
            <p className="text-sm text-muted-foreground">
              {customerName} ({customerEmail})
            </p>
            <p className="text-xs text-muted-foreground">
              Ticket #{ticketId.slice(0, 8)} • Created {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {(['pending', 'open', 'resolved', 'closed'] as const).map(statusOption => (
            <Button
              key={statusOption}
              variant={status === statusOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(statusOption)}
            >
              {statusOption}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 bg-muted/20 h-72">
        <div className="p-6 space-y-4">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              senderType={msg.sender_type}
              senderName={msg.sender_name}
              createdAt={msg.created_at}
              attachments={msg.attachments}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background shrink-0">
        {selectedFiles.length > 0 && (
          <div className="mb-3">
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
          
          <Textarea
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[80px] max-h-[200px]"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}