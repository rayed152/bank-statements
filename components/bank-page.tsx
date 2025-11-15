"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateStatementDialog from "@/components/create-statements";

interface BankPageClientProps {
  bank: {
    id: string;
    name: string;
    statements: {
      id: string;
      sl: number;
      date: string | Date;
      particular: string;
      instrumentNo?: string | null;
      withdraw: number;
      deposit: number;
      balance: number;
      remarks: string;
    }[];
  };
}

export default function BankPageClient({ bank }: BankPageClientProps) {
  const [openCreateStatement, setOpenCreateStatement] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{bank.name}</h1>
      <p>ID: {bank.id}</p>

      {/* Statements header with plus button */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Statements</h2>

        <Button
          variant="default"
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          onClick={() => setOpenCreateStatement(true)}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <table className="mt-2 w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">SL</th>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Particular</th>
            <th className="border border-gray-300 px-2 py-1">Instrument No</th>
            <th className="border border-gray-300 px-2 py-1">Withdraw</th>
            <th className="border border-gray-300 px-2 py-1">Deposit</th>
            <th className="border border-gray-300 px-2 py-1">Balance</th>
            <th className="border border-gray-300 px-2 py-1">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {bank.statements.length > 0 ? (
            bank.statements.map((stmt) => (
              <tr key={stmt.id}>
                <td className="border border-gray-300 px-2 py-1">{stmt.sl}</td>
                <td className="border border-gray-300 px-2 py-1">
                  {new Date(stmt.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.particular}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.instrumentNo || "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.withdraw}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.deposit}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.balance}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.remarks}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-2 py-1 text-center"
                colSpan={8}
              >
                No statements available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create Statement Dialog */}
      <CreateStatementDialog
        open={openCreateStatement}
        onOpenChange={setOpenCreateStatement}
        bankId={bank.id}
      />
    </div>
  );
}
