"use client";

import { useState, useMemo } from "react";
import { Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";
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

type SortField = keyof Pick<
  Statement,
  "sl" | "date" | "particular" | "deposit" | "withdraw" | "balance" | "remarks"
>;

export default function BankPageClient({ bank }: BankPageClientProps) {
  const [openCreateStatement, setOpenCreateStatement] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("sl");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const statementsPerPage = 5;

  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this statement?",
    );
    if (!confirmDelete) return;

    const res = await deleteStatement(id);
    if (res.success) router.refresh();
    else alert(res.error || "Failed to delete statement");
  };

  // Filter statements
  const filteredStatements = useMemo(() => {
    return bank.statements.filter(
      (stmt) =>
        stmt.particular.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stmt.instrumentNo?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ),
    );
  }, [bank.statements, searchQuery]);

  // Sort statements
  const sortedStatements = useMemo(() => {
    return [...filteredStatements].sort((a, b) => {
      let aValue: string | number = a[sortField] as string | number;
      let bValue: string | number = b[sortField] as string | number;

      if (sortField === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStatements, sortField, sortOrder]);

  // Pagination
  const indexOfLast = currentPage * statementsPerPage;
  const indexOfFirst = indexOfLast - statementsPerPage;
  const currentStatements = sortedStatements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedStatements.length / statementsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const columns: { label: string; field: SortField }[] = [
    { label: "SL", field: "sl" },
    { label: "DATE", field: "date" },
    { label: "PARTICULAR", field: "particular" },
    { label: "DEPOSIT", field: "deposit" },
    { label: "WITHDRAW", field: "withdraw" },
    { label: "BALANCE", field: "balance" },
    { label: "REMARKS", field: "remarks" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        {bank.name} [Total Balance:{" "}
        {bank.statements.length > 0
          ? bank.statements[bank.statements.length - 1].balance
          : 0}
        ]
      </h1>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Statements</h2>

        <input
          type="text"
          placeholder="Search by Particular or Instrument No"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/3"
        />

        <Button
          variant="default"
          className="w-auto h-10 p-2 flex items-center justify-center cursor-pointer"
          onClick={() => setOpenCreateStatement(true)}
        >
          Add Statements
        </Button>
      </div>

      <table className="mt-2 w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                className="border border-gray-300 px-2 py-1 cursor-pointer select-none"
                onClick={() => handleSort(col.field)}
              >
                {col.label}
                {sortField === col.field && (
                  <span className="inline ml-1">
                    {sortOrder === "asc" ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )}
                  </span>
                )}
              </th>
            ))}
            <th className="border border-gray-300 px-2 py-1">ACTIONS</th>
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
                  {stmt.deposit}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.withdraw}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.balance}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {stmt.remarks || "-"}
                </td>
                <td className="border border-gray-300 px-2 py-1 flex gap-2">
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
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 p-1"
                    onClick={() => handleDelete(stmt.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-2 py-1 text-center"
                colSpan={columns.length + 1}
              >
                No statements available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {sortedStatements.length > statementsPerPage && (
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

      {/* Dialogs */}
      <CreateStatementDialog
        open={openCreateStatement}
        onOpenChange={setOpenCreateStatement}
        bankId={bank.id}
      />
      <UpdateStatementDialog
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        statement={selectedStatement}
      />
    </div>
  );
}
