"use server";

import { db } from "@/lib/db";

export async function createBank(formData: FormData) {
  try {
    const name = formData.get("name")?.toString();

    if (!name) {
      throw new Error("Bank name is required.");
    }

    const bank = await db.bank.create({
      data: { name },
    });

    // // optional: refresh UI
    // revalidatePath("/banks");

    return { success: true, bank };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function getBankNames() {
  try {
    const banks = await db.bank.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return { success: true, banks };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

export async function getBankById(bankId: string) {
  try {
    if (!bankId) {
      throw new Error("Bank ID is required.");
    }

    const bank = await db.bank.findUnique({
      where: { id: bankId },
      include: {
        statements: true, // assuming your relation field is called 'statements'
      },
    });

    if (!bank) {
      return { success: false, error: "Bank not found" };
    }

    return { success: true, bank };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}
