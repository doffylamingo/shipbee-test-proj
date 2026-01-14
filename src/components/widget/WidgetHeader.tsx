import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WidgetHeaderProps {
  onClose: () => void;
}

export default function WidgetHeader({
  onClose
}: WidgetHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <span className="font-semibold text-base">ShipBee Support</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};