"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createStatement } from "@/actions/statement"; // adjust import path
import { useRouter } from "next/navigation";

// Default Particulars
const defaultParticulars = ["a", "b", "c", "d"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankId: string;
}

export default function CreateStatementDialog({
  open,
  onOpenChange,
  bankId,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [selectedParticular, setSelectedParticular] = useState("");
  const [customParticular, setCustomParticular] = useState("");
  const [instrumentNo, setInstrumentNo] = useState("");
  const [withdraw, setWithdraw] = useState<number | "">("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  // Combine selected + custom
  const fullParticular = selectedParticular
    ? `${selectedParticular}: ${customParticular}`.trim()
    : customParticular;

  const handleCreate = async () => {
    if (!fullParticular) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("bankId", bankId);
    formData.append("date", date);
    formData.append("particular", fullParticular);
    formData.append("instrumentNo", instrumentNo);
    if (withdraw !== "") formData.append("withdraw", withdraw.toString());
    if (deposit !== "") formData.append("deposit", deposit.toString());
    formData.append("remarks", remarks);

    const res = await createStatement(formData);

    setLoading(false);
    if (res.success) {
      onOpenChange(false);
      // reset form
      setDate("");
      setSelectedParticular("");
      setCustomParticular("");
      setInstrumentNo("");
      setWithdraw("");
      setDeposit("");
      setRemarks("");

      router.refresh();
    } else {
      alert(res.error || "Failed to create statement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* Particular Dropdown + Custom Input */}
          <div className="flex gap-2">
            <select
              value={selectedParticular}
              onChange={(e) => setSelectedParticular(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">--Select Particular--</option>
              {defaultParticulars.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter your particular"
              value={customParticular}
              onChange={(e) => setCustomParticular(e.target.value)}
              className="border p-2 rounded flex-1"
            />
          </div>

          <input
            type="text"
            placeholder="Instrument No"
            value={instrumentNo}
            onChange={(e) => setInstrumentNo(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Withdraw"
            value={withdraw}
            onChange={(e) => setWithdraw(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Deposit"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <Button onClick={handleCreate} disabled={loading || !fullParticular}>
            {loading ? "Creating..." : "Create Statement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
