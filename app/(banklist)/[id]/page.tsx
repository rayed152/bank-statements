import BankPageClient from "@/components/bank-page";
import { getBankById } from "@/actions/bank";

interface PageProps {
  params: Promise<{ id: string }>; // Next.js App Router dynamic params can be Promise
}

export default async function BankPage({ params }: PageProps) {
  const { id: bankId } = await params;

  if (!bankId) {
    return <p className="text-red-500">Bank ID is missing.</p>;
  }

  const result = await getBankById(bankId);

  if (!result.success || !result.bank) {
    return <p className="text-red-500">{result.error || "Bank not found."}</p>;
  }

  // Map server response to client-friendly types
  const bank = {
    id: result.bank.id,
    name: result.bank.name,
    statements: result.bank.statements.map((stmt) => ({
      id: stmt.id,
      sl: stmt.sl,
      date: stmt.date, // keep as Date or convert to string if you prefer
      particular: stmt.particular,
      instrumentNo: stmt.instrumentNo || undefined,
      withdraw: stmt.withdraw ?? 0,
      deposit: stmt.deposit ?? 0,
      balance: stmt.balance ?? 0,
      remarks: stmt.remarks || "",
    })),
  };

  return <BankPageClient bank={bank} />;
}
