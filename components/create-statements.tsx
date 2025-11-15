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
  const [sl, setSl] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [particular, setParticular] = useState("");
  const [instrumentNo, setInstrumentNo] = useState("");
  const [withdraw, setWithdraw] = useState<number | "">("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [balance, setBalance] = useState<number | "">("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!sl || !particular) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("bankId", bankId);
    formData.append("sl", sl.toString());
    formData.append("date", date);
    formData.append("particular", particular);
    formData.append("instrumentNo", instrumentNo);
    if (withdraw !== "") formData.append("withdraw", withdraw.toString());
    if (deposit !== "") formData.append("deposit", deposit.toString());
    if (balance !== "") formData.append("balance", balance.toString());
    formData.append("remarks", remarks);

    const res = await createStatement(formData);

    setLoading(false);
    if (res.success) {
      onOpenChange(false);
      // reset form
      setSl("");
      setDate("");
      setParticular("");
      setInstrumentNo("");
      setWithdraw("");
      setDeposit("");
      setBalance("");
      setRemarks("");
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
            type="number"
            placeholder="SL"
            value={sl}
            onChange={(e) => setSl(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Particular"
            value={particular}
            onChange={(e) => setParticular(e.target.value)}
            className="w-full border p-2 rounded"
          />

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
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <Button
            onClick={handleCreate}
            disabled={loading || !sl || !particular}
          >
            {loading ? "Creating..." : "Create Statement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
