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
import { useUserByEmail } from "@/hooks/useUsers";
import { useCreateConnection } from "@/hooks/useConnections";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface AddFriendDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFriendDialog({
  userId,
  open,
  onOpenChange,
}: AddFriendDialogProps) {
  const [email, setEmail] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { data: foundUser, isLoading: isSearching } = useUserByEmail(
    searchAttempted ? email : ""
  );
  const createConnection = useCreateConnection();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
  };

  const handleSendRequest = async () => {
    if (!foundUser) return;

    try {
      await createConnection.mutateAsync({
        userId1: userId,
        userId2: foundUser.id,
      });

      // Reset form
      setEmail("");
      setSearchAttempted(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send connection request:", error);
      alert("Failed to send connection request. They may already be a friend.");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail("");
      setSearchAttempted(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Search for friends by their email address
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSearchAttempted(false);
                }}
                required
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchAttempted && !isSearching && (
              <div className="rounded-lg border p-4">
                {foundUser ? (
                  foundUser.id === userId ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="size-4" />
                      <span>This is your own account</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {foundUser.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{foundUser.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {foundUser.email}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSendRequest}
                        disabled={createConnection.isPending}
                        className="w-full"
                      >
                        {createConnection.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="size-4" />
                            Send Friend Request
                          </>
                        )}
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="size-4" />
                    <span>No user found with this email address</span>
                  </div>
                )}
              </div>
            )}

            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {!searchAttempted && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!email}>
                Search
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
