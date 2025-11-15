"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createBank } from "@/actions/bank";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBankDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);

    await createBank(formData);

    setLoading(false);
    onOpenChange(false);
    setName("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bank</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            className="w-full border p-2 rounded-md"
            placeholder="Bank Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create Bank"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
