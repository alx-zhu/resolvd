import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLog } from "@/hooks/useLogs";
import { Loader2 } from "lucide-react";

interface QuickLogDialogProps {
  goalId: string;
  goalTitle: string;
  unitLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickLogDialog({
  goalId,
  goalTitle,
  unitLabel,
  open,
  onOpenChange,
}: QuickLogDialogProps) {
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const createLog = useCreateLog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    try {
      await createLog.mutateAsync({
        goal_id: goalId,
        value: numValue,
        note: note.trim() || undefined,
        logged_at: new Date().toISOString(),
      });

      // Reset form
      setValue("");
      setNote("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
          <DialogDescription>{goalTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                Amount ({unitLabel || "units"})
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder={`e.g., 5`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add details about your progress..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createLog.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLog.isPending}>
              {createLog.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Log Progress
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
