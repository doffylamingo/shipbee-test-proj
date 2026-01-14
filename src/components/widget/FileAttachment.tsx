import { X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileAttachmentProps {
  files: File[];
  onRemove: (index: number) => void;
  onAdd: (files: File[]) => void;
  showUploadArea?: boolean;
}

export default function FileAttachment ({
  files,
  onRemove,
  onAdd,
  showUploadArea = true
}: FileAttachmentProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAdd(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-2">
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm bg-accent p-2 rounded-md">
              <span className="truncate flex items-center gap-2">
                <Paperclip className="h-3 w-3" />
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(idx)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showUploadArea && (
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
            <Paperclip className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Attach files</span>
          </div>
        </label>
      )}
    </div>
  );
};