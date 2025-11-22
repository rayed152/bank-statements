"use server";

import { db } from "@/lib/db";

export async function createStatement(formData: FormData) {
  try {
    const bankId = formData.get("bankId")?.toString();
    const date = new Date(formData.get("date") as string);
    const particular = formData.get("particular")?.toString();
    const instrumentNo = formData.get("instrumentNo")?.toString();

    const withdraw = formData.get("withdraw")
      ? Number(formData.get("withdraw"))
      : 0;

    const deposit = formData.get("deposit")
      ? Number(formData.get("deposit"))
      : 0;

    const remarks = formData.get("remarks")?.toString() || null;

    if (!bankId || !particular) {
      throw new Error("Bank ID, SL, and Particular are required.");
    }

    // 1️⃣ Get the last known balance for this bank
    const lastStatement = await db.statement.findFirst({
      where: { bankId },
      orderBy: { sl: "desc" },
    });

    const sl = lastStatement ? lastStatement.sl + 1 : 1;

    const previousBalance = lastStatement?.balance ?? 0;

    // 2️⃣ Calculate new balance
    const newBalance = previousBalance + deposit - withdraw;

    // 3️⃣ Save with computed balance
    const statement = await db.statement.create({
      data: {
        bankId,
        sl,
        date,
        particular,
        instrumentNo,
        withdraw: withdraw || null,
        deposit: deposit || null,
        balance: newBalance,
        remarks,
      },
    });

    return { success: true, statement };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function deleteStatement(id: string) {
  try {
    // 1️⃣ Find the statement to delete (we need its bankId)
    const existing = await db.statement.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Statement not found." };
    }

    const bankId = existing.bankId;

    // 2️⃣ Delete the statement
    await db.statement.delete({
      where: { id },
    });

    // 3️⃣ Fetch all remaining statements sorted by SL
    const statements = await db.statement.findMany({
      where: { bankId },
      orderBy: { sl: "asc" },
    });

    // 4️⃣ Recompute SL and balances from scratch
    let runningBalance = 0;
    let currentSL = 1;

    for (const stmt of statements) {
      const withdraw = stmt.withdraw ?? 0;
      const deposit = stmt.deposit ?? 0;

      runningBalance = runningBalance + deposit - withdraw;

      await db.statement.update({
        where: { id: stmt.id },
        data: {
          sl: currentSL,
          balance: runningBalance,
        },
      });

      currentSL++;
    }

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function updateStatement(id: string, formData: FormData) {
  try {
    // 1️⃣ Find existing statement
    const existing = await db.statement.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Statement not found." };
    }

    const bankId = existing.bankId;

    // 2️⃣ Extract values from formData
    const date = new Date(formData.get("date") as string);
    const particular = formData.get("particular")?.toString();
    const instrumentNo = formData.get("instrumentNo")?.toString() || null;
    const withdraw = formData.get("withdraw")
      ? Number(formData.get("withdraw"))
      : 0;
    const deposit = formData.get("deposit")
      ? Number(formData.get("deposit"))
      : 0;
    const remarks = formData.get("remarks")?.toString() || null;

    // 3️⃣ Update the statement itself
    await db.statement.update({
      where: { id },
      data: {
        date,
        particular,
        instrumentNo,
        withdraw,
        deposit,
        remarks,
      },
    });

    // 4️⃣ Fetch all statements sorted by SL
    const statements = await db.statement.findMany({
      where: { bankId },
      orderBy: { sl: "asc" },
    });

    // 5️⃣ Recalculate SL + balance
    let runningBalance = 0;
    let currentSL = 1;

    for (const stmt of statements) {
      const w = stmt.withdraw ?? 0;
      const d = stmt.deposit ?? 0;

      runningBalance = runningBalance + d - w;

      await db.statement.update({
        where: { id: stmt.id },
        data: {
          sl: currentSL,
          balance: runningBalance,
        },
      });

      currentSL++;
    }

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}
