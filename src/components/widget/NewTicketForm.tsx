import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileAttachment  from './FileAttachment';

interface NewTicketFormProps {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  selectedFiles: File[];
  onCustomerNameChange: (name: string) => void;
  onCustomerEmailChange: (email: string) => void;
  onSubjectChange: (subject: string) => void;
  onMessageChange: (message: string) => void;
  onFilesChange: (files: File[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function NewTicketForm ({
  customerName,
  customerEmail,
  subject,
  message,
  selectedFiles,
  onCustomerNameChange,
  onCustomerEmailChange,
  onSubjectChange,
  onMessageChange,
  onFilesChange,
  onSubmit,
  onBack,
  isLoading = false
}: NewTicketFormProps) {
  const removeFile = (index: number) => {
    onFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  const addFiles = (newFiles: File[]) => {
    onFilesChange([...selectedFiles, ...newFiles]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b shrink-0">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          ← Back
        </Button>
      </div>
      <ScrollArea className="flex-1 h-72">
        <div className="p-4 space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={customerEmail}
              onChange={(e) => onCustomerEmailChange(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          
          <FileAttachment
            files={selectedFiles}
            onRemove={removeFile}
            onAdd={addFiles}
          />
        </div>
      </ScrollArea>
      <div className="p-4 border-t shrink-0">
        <Button
          onClick={onSubmit}
          className="w-full"
          disabled={isLoading || !customerName || !customerEmail || !subject || !message}
        >
          {isLoading ? 'Creating...' : 'Start Conversation'}
        </Button>
      </div>
    </div>
  );
};