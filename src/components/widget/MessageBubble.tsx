import { Paperclip } from 'lucide-react';

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
}

interface MessageBubbleProps {
  content: string;
  senderType: 'customer' | 'admin';
  senderName: string;
  createdAt: string;
  attachments?: Attachment[];
}

export default function MessageBubble ({
  content,
  senderType,
  senderName,
  createdAt,
  attachments = []
}: MessageBubbleProps) {
  const isCustomer = senderType === 'customer';

  return (
    <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isCustomer
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted'
      }`}>
        <p className="text-xs opacity-75 mb-1">{senderName}</p>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {attachments.map((att) => (
              <a
                key={att.id}
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs underline hover:opacity-80"
              >
                <Paperclip className="h-3 w-3" />
                {att.file_name}
              </a>
            ))}
          </div>
        )}
        <p className="text-xs opacity-75 mt-1">
          {new Date(createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};