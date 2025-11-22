"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateStatementDialog from "@/components/create-statements";
import UpdateStatementDialog from "@/components/update-statements";
import { useRouter } from "next/navigation";
import { deleteStatement } from "@/actions/statement";

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

interface Bank {
  id: string;
  name: string;
  statements: Statement[];
}

interface BankPageClientProps {
  bank: Bank;
}

export default function BankPageClient({ bank }: BankPageClientProps) {
  const [openCreateStatement, setOpenCreateStatement] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const statementsPerPage = 5;

  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this statement?",
    );
    if (!confirmDelete) return;

    const res = await deleteStatement(id);

    if (res.success) {
      router.refresh(); // reload page data
    } else {
      alert(res.error || "Failed to delete statement");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * statementsPerPage;
  const indexOfFirst = indexOfLast - statementsPerPage;
  const currentStatements = bank.statements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bank.statements.length / statementsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{bank.name}</h1>

      {/* Statements header with plus button */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Statements</h2>

        <div>
          [Total Balance:{" "}
          {bank.statements.length > 0
            ? bank.statements[bank.statements.length - 1].balance
            : 0}
          ]{" "}
        </div>
        <Button
          variant="default"
          className=" w-auto h-10 p-2 flex items-center justify-center cursor-pointer"
          onClick={() => setOpenCreateStatement(true)}
        >
          Add Statements
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
            <th className="border border-gray-300 px-2 py-1">
              Delete / Update
            </th>
          </tr>
        </thead>
        <tbody>
          {currentStatements.length > 0 ? (
            currentStatements.map((stmt) => (
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
                  {stmt.remarks || "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex gap-2">
                    {/* Update Button */}
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => {
                        setSelectedStatement(stmt);
                        setOpenUpdate(true);
                      }}
                    >
                      <Pencil size={18} />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-800 p-1"
                      onClick={() => handleDelete(stmt.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-2 py-1 text-center"
                colSpan={9}
              >
                No statements available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {bank.statements.length > statementsPerPage && (
        <div className="flex justify-between mt-4">
          <Button onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}

      {/* Create Statement Dialog */}
      <CreateStatementDialog
        open={openCreateStatement}
        onOpenChange={setOpenCreateStatement}
        bankId={bank.id}
      />

      {/* Update Statement Dialog */}
      <UpdateStatementDialog
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        statement={selectedStatement}
      />
    </div>
  );
}
