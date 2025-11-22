"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateStatement } from "@/actions/statement";
import { useRouter } from "next/navigation";

interface Statement {
  id: string;
  sl: number;
  date: string | Date;
  particular: string;
  instrumentNo?: string | null;
  withdraw: number;
  deposit: number;
  balance: number;
  remarks: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statement: Statement | null;
}

export default function UpdateStatementDialog({
  open,
  onOpenChange,
  statement,
}: Props) {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [particular, setParticular] = useState("");
  const [instrumentNo, setInstrumentNo] = useState("");
  const [withdraw, setWithdraw] = useState<number | "">("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  // Prefill values when a statement is selected
  useEffect(() => {
    if (!statement) return;

    const formattedDate = new Date(statement.date)
      .toISOString()
      .substring(0, 10);

    // Wrap state updates in a microtask
    Promise.resolve().then(() => {
      setDate(formattedDate);
      setParticular(statement.particular);
      setInstrumentNo(statement.instrumentNo || "");
      setWithdraw(statement.withdraw ?? 0);
      setDeposit(statement.deposit ?? 0);
      setRemarks(statement.remarks || "");
    });
  }, [statement]);

  const handleUpdate = async () => {
    if (!statement) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("date", date);
    formData.append("particular", particular);
    formData.append("instrumentNo", instrumentNo);
    formData.append("withdraw", withdraw.toString());
    formData.append("deposit", deposit.toString());
    formData.append("remarks", remarks);

    const res = await updateStatement(statement.id, formData);

    setLoading(false);

    if (res.success) {
      onOpenChange(false);
      router.refresh();
    } else {
      alert(res.error || "Failed to update statement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={particular}
            onChange={(e) => setParticular(e.target.value)}
            placeholder="Particular"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={instrumentNo}
            onChange={(e) => setInstrumentNo(e.target.value)}
            placeholder="Instrument No"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            value={withdraw}
            onChange={(e) => setWithdraw(Number(e.target.value))}
            placeholder="Withdraw"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            placeholder="Deposit"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
            className="w-full border p-2 rounded"
          />

          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Statement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
