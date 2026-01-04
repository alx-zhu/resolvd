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
import { useUpdateLog } from "@/hooks/useLogs";
import { Loader2 } from "lucide-react";
import type { Log } from "@/types/goals";

interface EditLogDialogProps {
  log: Log | null;
  goalId: string;
  unitLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLogDialog({
  log,
  goalId,
  unitLabel,
  open,
  onOpenChange,
}: EditLogDialogProps) {
  // Initialize state directly from log when dialog opens
  const [value, setValue] = useState(log?.value.toString() || "");
  const [note, setNote] = useState(log?.note || "");
  const updateLog = useUpdateLog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!log) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    try {
      await updateLog.mutateAsync({
        logId: log.id,
        goalId,
        updates: {
          value: numValue,
          note: note.trim() || undefined,
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update log:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && log) {
      // When opening, initialize form with log data
      setValue(log.value.toString());
      setNote(log.note || "");
    } else if (!newOpen) {
      // When closing, reset form
      setValue("");
      setNote("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Log Entry</DialogTitle>
          <DialogDescription>
            Update the value or note for this log entry
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-value">
                Amount ({unitLabel || "units"})
              </Label>
              <Input
                id="edit-value"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (optional)</Label>
              <Textarea
                id="edit-note"
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
              onClick={() => handleOpenChange(false)}
              disabled={updateLog.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLog.isPending}>
              {updateLog.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
